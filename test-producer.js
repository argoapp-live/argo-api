const { Producer } = require("sqs-producer");
const { v4: uuidv4 } = require('uuid');

// create simple producer
const producer = Producer.create({
  queueUrl:
    "https://sqs.us-east-1.amazonaws.com/141264133120/dev-deployment-queue.fifo",
  region: "us-east-1",
});

// export async function checkSize(params:type) {

// }

// producer.queueSize().then((size) => {
//     console.log('queue size', size);
// });

// const array = [];

// for (let i=0;i<100;i++) array.push(i);

// array.forEach((element) => {

//     producer.send({
//         id: "testId",
//         body: `Element: ${element}`,
//         groupId: 'group1234',
//     });
// })

// const msg = '{"deploymentId":"6141e23e35e9b2c2c63993c","githubUrl":"https://github.com/rekpero/simple-test-app.git --branch main","folderName":"simple-test-app","topic":"todelete","framework":"static","packageManager":"","branch":"main","buildCommand":"","publishDir":"","protocol":"skynet","workspace":"","is_workspace":false,"logsToCapture":[{"key":"sitePreview","value":"https://siasky.net"}],"env":null}'

const payload = {
  githubUrl: "https://github.com/rekpero/quaero-angular-client.git",
  folderName: "quaero-angular-client",
  framework: "angular",
  packageManager: "npm",
  buildCommand: "build",
  publishDirectory: "dist/quaero-frontend-assignment",
  workspace: "",
  protocol: "arweave",
  random: "rr rekperoo",
};

producer.send({
  id: "testId",
  body: JSON.stringify(payload),
  groupId: uuidv4(),
});
