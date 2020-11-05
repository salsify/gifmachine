# Infra Structure


## Requirements
To provision the infrastructure structure it is necessary:
+ [Pulumi](https://www.pulumi.com/docs/get-started/aws/)
+ NodeJs 
+ Account in AWS and IAM user with enough privileges to create resources
+ Account in Pulumi
  
## Deploy Infrastructure

After setup your local environment execute the following command:
```
pulumi up
```
*Note:* It will ask to login if it is the first time to use the cli
Accept the changes and wait. Normally it takes 15 mins to have all the resources up

## Access Gifmachine
To access the gif machine execute the command `pulumi stack config gifMachineAddress` to show the Gif Machine address 

To get the password of gifmachine run `pulumi stack config gifMachinePassword`

## Access the EKS cluster 
For this it is necessary to have `kubectl` in your machine or an GUI client , my favorite is [Lens](https://k8slens.dev/)
```shell
pulumi stack config kubeconfig > eks-config
export KUBECONFIG=eks-config
# To find the gifmachine deployment 
kubectl get deploy gifmachine -n moser-cloud 
```


## Arch

The resources in this arch are the following:
- Dedicated VPC
- Amazon RDS
- EKS Cluster

The EKS Cluster contains 1 Deployment resource to manage the gifmachine and 1 ConfigMap and 2 Secrets to provide the necessary configuration to the gifmachine

Diagram of the solution made in [LucidChart](https://lucid.app/documents/view/d8b7ec78-15f1-4f00-a63e-8f93ec13f5de)