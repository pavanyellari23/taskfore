const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner(
  {
    options: {
      'sonar.sources': '.',
      // eslint-disable-next-line no-undef
      'sonar.host.url': `${process.env.SONAR_HOST_URL}`,
      // eslint-disable-next-line no-undef
      'sonar.login': `${process.env.SONAR_TOKEN}`,
      // eslint-disable-next-line no-undef
      'sonar.projectKey': `revin-${process.env.CI_PROJECT_NAME}-${process.env.CI_COMMIT_BRANCH}`,
      'sonar.inclusions': 'src/**'
    }
  },
  () => {}
);
