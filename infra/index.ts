import * as awsx from '@pulumi/awsx';
import * as eks from '@pulumi/eks';
import * as k8s from '@pulumi/kubernetes';
import * as aws from '@pulumi/aws';
import * as random from '@pulumi/random';
import * as pulumi from '@pulumi/pulumi';

const projectName = 'moser-cloud';
const dbName = 'dbGifmachine';
// Create a VPC for our cluster.
const vpc = new awsx.ec2.Vpc(`${projectName}-vpc-cluster`, {
  numberOfAvailabilityZones: 2,
});

// Create the EKS cluster itself and a deployment of the Kubernetes dashboard.
const cluster = new eks.Cluster(`${projectName}-cluster`, {
  vpcId: vpc.id,
  subnetIds: vpc.publicSubnetIds,
  instanceType: 't2.micro',
  desiredCapacity: 2,
  deployDashboard: false,
  version: '1.18',
  minSize: 2,
  maxSize: 3,
  enabledClusterLogTypes: ['api', 'audit', 'authenticator'],
});

const dbPassword = new random.RandomPassword('db-gifmachine-password', {
  length: 16,
  special: false,
});
export const gifMachinePassword = new random.RandomPassword('gifmachine-password', {
  length: 16,
  special: false,
}).result;

const subnetGroup = new aws.rds.SubnetGroup('dbsubnets', {
  subnetIds: vpc.privateSubnetIds,
});

const dbGifmachine = new aws.rds.Instance('db-gifmachine', {
  engine: 'postgres',
  engineVersion: '9.6',
  instanceClass: aws.rds.InstanceTypes.T2_Micro,
  allocatedStorage: 5,
  dbSubnetGroupName: subnetGroup.id,
  vpcSecurityGroupIds: [cluster.nodeSecurityGroup.id, cluster.clusterSecurityGroup.id],
  name: dbName,
  username: 'postgress',
  password: dbPassword.result,
  skipFinalSnapshot: true,
});

const clusterAppNamespace = new k8s.core.v1.Namespace(
  projectName,
  {
    metadata: { name: projectName },
  },
  { provider: cluster.provider },
);

new k8s.core.v1.Secret(
  'db-gifmachine-secret',
  {
    metadata: {
      name: 'db-gifmachine-secret',
      namespace: clusterAppNamespace.metadata.name,
    },
    stringData: {
      'db-password': dbPassword.result,
    },
  },
  { provider: cluster.provider },
);

new k8s.core.v1.Secret(
  'gifmachine-secret',
  {
    metadata: {
      name: 'gifmachine-secret',
      namespace: clusterAppNamespace.metadata.name,
    },
    stringData: {
      password: gifMachinePassword,
    },
  },
  { provider: cluster.provider },
);
new k8s.core.v1.ConfigMap(
  'db-gifmachine-config',
  {
    metadata: {
      name: 'db-gifmachine-config',
      namespace: clusterAppNamespace.metadata.name,
    },
    data: {
      'db-hostname': dbGifmachine.address,
      'db-user': dbGifmachine.username,
      'db-name': dbName,
    },
  },
  { provider: cluster.provider },
);
const gifMachine = new k8s.yaml.ConfigFile(
  'gifMachine',
  {
    file: './kube-manifests/gifmachine.yaml',
  },
  {
    provider: cluster.provider,
  },
);

const loadBalancer = gifMachine.getResource('v1/Service', 'moser-cloud', 'gifmachine');
// Export gifMachine Address to be used to access the service
export const gifMachineAddress = pulumi.interpolate`${loadBalancer.status.loadBalancer.ingress[0].hostname}:${loadBalancer.spec.ports[0].port}`;
// Export the cluster's kubeconfig.
export const kubeconfig = cluster.kubeconfig;
