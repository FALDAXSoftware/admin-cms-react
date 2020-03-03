#!/usr/bin/env groovy
def label = "buildpod.${env.JOB_NAME}.${env.BUILD_NUMBER}".replace('-', '_').replace('/', '_').take(63)
def gitCredentialsId = "github"
def imageRepo = "100.69.158.196"
podTemplate(label: label, nodeSelector: 'env=jenkins' , containers: [
    //  containerTemplate(name: 'build-container', image: imageRepo + '/buildtool:deployer', command: 'cat', ttyEnabled: true),
     containerTemplate(
        name: 'node', 
        resourceRequestCpu: '50m',
        resourceLimitCpu: '2000m',
        resourceRequestMemory: '100Mi',
        resourceLimitMemory: '2500Mi',
        image: 'node:8.15.0-alpine', 
        command: 'cat', 
        ttyEnabled: true),
], 
volumes: [
    hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
  ]
){
  timeout(45){
      def coinToDeploy;
      def triggerByUser;
      def namespace;
      node(label) {
     
         // Wipe the workspace so we are building completely clean
         deleteDir()

         stage('Docker Build'){
         container('node'){
              def myRepo = checkout scm
              gitCommit = myRepo.GIT_COMMIT
              shortGitCommit = "${gitCommit[0..10]}"
              imageTag = shortGitCommit
              namespace = getNamespace(myRepo.GIT_BRANCH);
              if (namespace){
              sh "ls -la"
              sh "apk update "
              sh "apk upgrade "
              sh "apk add --no-cache bash git openssh"
              sh "npm install"
              sh "npm run build${getEnvConfig(myRepo.GIT_BRANCH)}"
              sh "ls -la" 
              if (env.BRANCH_NAME == 'development') {
                        withAWS(credentials:'jenkins_s3_upload') {
                        s3Delete(bucket:'staging-admin.faldax.com', path:'')
                        s3Upload(file:'build', bucket:'staging-admin.faldax.com', path:'')
                    }
                }
              else if (env.BRANCH_NAME == 'master') {
                        withAWS(credentials:'jenkins_s3_upload') {
                        s3Delete(bucket:'admin.faldax.com', path:'')
                        s3Upload(file:'build', bucket:'admin.faldax.com', path:'')
                }
                }else if (env.BRANCH_NAME == 'preprod') {
                        withAWS(credentials:'jenkins_s3_upload') {
                        s3Delete(bucket:'preprod-admin.faldax.com', path:'')
                        s3Upload(file:'build', bucket:'preprod-admin.faldax.com', path:'')
                }
                }
                
              
                 }

         }
         }

         }
    }   } 






def getNamespace(branch){
    switch(branch){
        case 'master' : return "prod";
        case 'development' :  return "dev";
        case 'preprod' :  return "preprod";
        default : return "dev";
    }
}
def getEnvConfig(branch){
  switch(branch){
      case 'development' :  return ":preprod";
      case 'preprod' :  return ":preprod";
      case 'mainnet' :  return ":mainnet";
      default : return "";
  }
}


