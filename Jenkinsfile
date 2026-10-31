pipeline {
  agent any
  stages {
    stage('Backend tests') {
      steps { dir('backend/inventory-backend') { sh './mvnw test -q' } }
    }
    stage('Frontend build') {
      steps { dir('frontend/inventory-frontend') { sh 'npm ci && npm run build' } }
    }
    stage('Docker build') {
      when { branch 'main' }
      steps { sh 'docker compose build' }
    }
  }
}
