pipeline {
    agent any

    environment {
        IMAGE_NAME = "devops-counter-app"
        VERSION    = "1.0.${BUILD_NUMBER}"
    }

    stages {
        stage('Clone') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test Container') {
            steps {
                sh """
                    docker build \
                    --build-arg GIT_COMMIT=\$(git rev-parse --short HEAD) \
                    --build-arg BUILD_NUMBER=${BUILD_NUMBER} \
                    -t ${IMAGE_NAME}:${VERSION} .
                """
            }
        }

        stage('Publish Artifact') {
            steps {
                sh "docker tag ${IMAGE_NAME}:${VERSION} ${IMAGE_NAME}:latest"
                echo "Otagowano artefakt jako: ${IMAGE_NAME}:${VERSION}"
            }
        }

        stage('Deploy & Smoke Test') {
            steps {
                script {
                    def vmIp = sh(script: "hostname -I | awk '{print \$1}'", returnStdout: true).trim()
                    
                    sh "docker rm -f counter-container || true"
                    sh "docker run -d --name counter-container -p 3000:3000 ${IMAGE_NAME}:${VERSION}"
                    
                    echo "Wykonuję Smoke Test na adresie: http://${vmIp}:3000/api/health"
                    sh """
                        sleep 3
                        curl -f http://${vmIp}:3000/api/health || (docker logs counter-container && exit 1)
                    """
                }
            }
        }
    }
    
    post {
        always {
            script {
                sh "docker inspect ${IMAGE_NAME}:${VERSION} > docker-inspect-${VERSION}.json || true"
                sh "docker logs counter-container > container-logs-${VERSION}.txt || true"
            }
            archiveArtifacts artifacts: "*.json, *.txt", allowEmptyArchive: true
        }
    }
}