# Coding Exercise Notes

## Decisions made
In consideration, the primary requirement was to have the solution implemented in the AWS cloud and using containers. I had two solutions in mind or used Elastic Container Service or Amazon Elastic Kubernetes Service (Amazon EKS). 
I decided to use EKS because I am already familiar with that solution; the EKS provided me out of the box almost the features I need to have the best solution and because booth solutions don't have a free tier. Only the EC2 instances used in the cluster have a free tier.
The usage of AWS RDS was my first option because I don't want to manage DB; if I can get that resource as a service from the provider, why not use it.

### Solution Arch
In the hosting environment's architecture, it uses a VPC to ensure network isolation and Amazon RDS to host the DB and the EKS to provide the application's management.  
The application is deployed using a Deployment resource; this resource gives the capability to manage the updates and to have mechanisms to ensure when the application is ready to serve traffic using the readiness Probe.  
The Readiness Probe uses the /gif endpoint because that endpoint requires a connection to DB, so it is a good endpoint to make sure the application is ready for service.  

It is exposed to the internet using a Service resource with type LoadBalancer, which allows using the AWS integration to expose the service.  
The usage of Secrets and ConfigMaps gives the capability to have environment-specific configuration and secrets.


All the setup was implemented using the Infrastructure As a Code mindset and using the declarative approach. 


### Tools
I use the [Pulumi](https://www.pulumi.com/) because it was a tool I used in the past in a POC, and I liked it. Because of my JS Developer background, it was easier to develop the infrastructure with this tool rather than use another tool like Terraform. Also, Pulumi provides a friendly interface, and it stores the state of the resources in the cloud, so I don't need to be worried about the state file.

### Topics to implement
Find a way to use Alpine image in Container image
Find a way to lower the user's privileges in the container image and execute the bundle binary.
Implement a GitHub Action that deploys the master version of the code by using a specific container tag
Implement issues present in the repository