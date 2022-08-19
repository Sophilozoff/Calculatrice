def CONTAINER_FRONT_NAME="simple-calculator_frontend-calculator_1"
def CONTAINER_BACK_NAME="simple-calculator_back-calculator_1"

node {

    stage('Initialize'){
        def dockerHome = tool 'docker'
        def mavenHome  = tool 'maven'
        env.PATH = "${dockerHome}/bin:${mavenHome}/bin:${env.PATH}"
    }

    stage 'Clone the project'
    git 'https://github.com/Sophilozoff/calculatrice'

    stage('Build'){
        sh "mvn clean install"
    }

    stage('Tests'){
        sh "mvn test"
    }

    stage("Image Prune"){
        imagePrune(CONTAINER_FRONT_NAME)
        imagePrune(CONTAINER_BACK_NAME)
    }

    stage('Docker Compose'){
        sh 'docker-compose -f docker-compose.yml up'
    }

}

def imagePrune(containerName){
    try {
        sh "docker image prune -f"
        sh "docker stop $containerName"
    } catch(error){}
}

def imageBuild(containerName, tag){
    sh "docker build -t $containerName:$tag  -t $containerName --pull --no-cache ."
    echo "Image build complete"
}

def pushToImage(containerName, tag, dockerUser, dockerPassword){
    sh "docker login -u $dockerUser -p $dockerPassword"
    sh "docker tag $containerName:$tag $dockerUser/$containerName:$tag"
    sh "docker push $dockerUser/$containerName:$tag"
    echo "Image push complete"
}

def runApp(containerName, tag, dockerHubUser, httpPort){
    sh "docker pull $dockerHubUser/$containerName"
    sh "docker run -d --rm -p $httpPort:$httpPort --name $containerName $dockerHubUser/$containerName:$tag"
    echo "Application started on port: ${httpPort} (http)"
}