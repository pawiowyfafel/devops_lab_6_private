pipeline {
    agent any

    environment {
        IMAGE_NAME = "devops-counter-app"
        VERSION    = "1.0.${BUILD_NUMBER}"
    }
    
    options {
        skipDefaultCheckout(true)
    }

    stages {
        stage('Clean & Clone') {
            steps {
                cleanWs() 
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                sh """
                    docker build \
                    --build-arg GIT_COMMIT=\$(git rev-parse --short HEAD) \
                    --build-arg BUILD_NUMBER=${BUILD_NUMBER} \
                    -t ${IMAGE_NAME}:${VERSION} .
                """
            }
        }

        stage('Deploy') {
            steps {
                script {
                    def targetHost = "docker"
                    
                    sh "docker rm -f counter-container || true"
                    sh "docker run -d --name counter-container -p 3000:3000 ${IMAGE_NAME}:${VERSION}"
                    
                    echo "Wykonuję Smoke Test na adresie: http://${targetHost}:3000/api/health"
                    sh """
                        sleep 5
                        curl -f http://${targetHost}:3000/api/health || (docker logs counter-container && exit 1)
                    """
                }
            }
        }

        stage('Publish') {
            steps {
                sh "docker save -o ${IMAGE_NAME}-${VERSION}.tar ${IMAGE_NAME}:${VERSION}"
                
                archiveArtifacts artifacts: "*.tar", allowEmptyArchive: false
            }
        }
    }
}