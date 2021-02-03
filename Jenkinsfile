pipeline {
    agent any

    stages {
        stage('Build Container') {
            steps {
                sh '''
                   npm install
                   yarn build --prod
                   docker build --tag localhost:32000/kezadomaps:1.0 .
                   docker push localhost:32000/kezadomapsr:1.0
                   '''
            }
        }
        stage('Deploy') {
            steps {
                sh 'echo kubectl delete -f kubernetes.yaml'
                sh 'kubectl apply -f kubernetes.yaml'
            }
        }
    }
}