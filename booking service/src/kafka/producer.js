const {Kafka}=require("kafkajs");
const Kafka=new Kafka({clientId:"irctc-app",brokers:["localhost:9092"]});
const producer=Kafka.producer();
async function sendPaymentSuccessEvent(data){
    await producer.connect();
    await producer.send({topic:"payment-success",messages:[{value:JSON.stringify(data)}]})
}

module.exports={sendPaymentSuccessEvent}