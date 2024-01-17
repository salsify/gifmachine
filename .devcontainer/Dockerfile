FROM mcr.microsoft.com/devcontainers/ruby:1-3.1-bookworm

# Install Rails
RUN su vscode -c "gem install rails webdrivers"
RUN su vscode -c "/usr/local/rvm/bin/rvm fix-permissions"

# Default value to allow debug server to serve content over GitHub Codespace's port forwarding service
# The value is a comma-separated list of allowed domains 
ENV RAILS_DEVELOPMENT_HOSTS=".githubpreview.dev,.preview.app.github.dev,.app.github.dev"
ENV RACK_ENV='development'
ENV PULUMI_CONFIG_PASSPHRASE='PULUMI_DEVELOPMENT'
ENV KUBECTL_VERSION=v1.25.10

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
     && apt-get -y install --no-install-recommends postgresql-client

# Install Pulumi
RUN su vscode -c "curl -fsSL https://get.pulumi.com | sh"     

# Install AWS CLI
RUN su vscode -c 'curl https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o /tmp/awscliv2.zip' \
     && su vscode -c 'unzip /tmp/awscliv2.zip -d /tmp' \ 
     && su vscode -c "sudo /tmp/aws/install"

# Install Kubectl
RUN wget -qO /usr/bin/kubectl https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl && chmod +x /usr/bin/kubectl


# [Optional] Uncomment this line to install additional gems.
# RUN su vscode -c "gem install <your-gem-names-here>"

# [Optional] Uncomment this line to install global node packages.
# RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && npm install -g <your-package-here>" 2>&1
