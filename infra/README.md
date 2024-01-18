# Infra Structure


## Requirements
To provision the infrastructure structure it is necessary:
+ Account in AWS and IAM user with enough privileges to create resources
If you are not using the devcontainer you will need the following dependencies
+ [Pulumi](https://www.pulumi.com/docs/install/) 
+ NodeJs using nvm
+ Install NodeJs dependencies using `npm ci`
  
## Deploy Infrastructure

After setup your local environment execute the following commands:
1. Initialize pulumi local stack `pulumi login file://.`
2. Export AWS credentials `export AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID> AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>`
3. Preview dev stack `pulumi preview --stack dev`
   1. Accept the creation of stack
4. Apply dev stack `pulumi up --stack dev`


Accept the changes and wait. Normally it takes 15 mins to have all the resources up

## Access Gifmachine
To access the gif machine execute the command `pulumi stack --stack dev output gifMachineAddress` to show the Gif Machine address 

To get the password of gifmachine run `pulumi stack --stack dev output gifMachinePassword`

## Access the EKS cluster 
For this it is necessary to have `kubectl` in your machine or an GUI client , my favorite is [Lens](https://k8slens.dev/)
```shell
pulumi stack --stack dev output kubeconfig > eks-config
export KUBECONFIG=eks-config
# To find the gifmachine deployment 
kubectl get deploy gifmachine -n moser-cloud 
```

## Destroy Infrastructure
To destroy infrastructure
1. `pulumi destroy stack --dev`

## Arch

The resources in this arch are the following:
- Dedicated VPC
- Amazon RDS
- EKS Cluster

The EKS Cluster contains 1 Deployment resource to manage the gifmachine and 1 ConfigMap and 2 Secrets to provide the necessary configuration to the gifmachine

Diagram of the solution made in [LucidChart](https://lucid.app/documents/view/d8b7ec78-15f1-4f00-a63e-8f93ec13f5de)