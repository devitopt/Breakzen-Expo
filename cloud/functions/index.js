const functions = require("firebase-functions");
const stripe = require("stripe")(
  "sk_test_51JgygeEEI6dOK9WQT2aV43U3OUM0056TGKr2TN6JBFoAend88DhCKv0DUfFpcXWFesULk1sRvRzPGSa8eaMHZuBL006x4gF1CQ"
);
const admin = require("firebase-admin");
const request = require('request');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

exports.createSubscription = functions.https.onCall(async (data, context) => {

    const subscription = await stripe.subscriptions.create({
      customer: data.customerId,
      items: [{ price: data.price }],
    });

    return {  subscriptionId: subscription.id  };
  }
);

exports.cancelSubscription = functions.https.onCall(async (data, context) => {
    const cancelled = await stripe.subscriptions.del(
      data.subscriptionId,
      {
        prorate: data.prorate,
      }
    );
    return {  subscriptionId: cancelled.id  };
  }
);

exports.sendNotification = functions.https.onCall(async (data, context) => {

    request({
      url: 'https://exp.host/--/api/v2/push/send',
      method: 'POST',
      headers: {
        'Content-Type' :' application/json',
        'Host': 'exp.host'
        // 'Authorization': 'key=AAAAyXm2nCY:APA91bG_o7rmABysyvdyW6clnbf1rodwpYmng7nFL59Dp6bVAj3MGxlAT1PNSn3O326sFvFw1XKrzPN7dN40FjFr-GeEacZWwVZWegksKzRBPkUDbJDt_MXtC5ImcLh58SQiPe84BWpe'
      },
      body: JSON.stringify(
        
       
        data.tokenArray
      
      
        // notification: {
        //   title: "Breakzen",
        //   body:data.body,
        //   sound:"default"
        // },
        // to : data.to
      )
    }, function(error, response, body) {
      if (error) { return {'status': error} }
      else if (response.statusCode >= 400) { 
        //console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage);
        return { 'status': 'HTTP Error: '+response.statusCode+' - '+response.statusMessage }
      }
      else {
        return { 'status': "success" }
      }    
  })
})

// exports.retrievePaymentMethod = functions.https.onCall(
//   async (data, context) => {
//     const customers = await stripe.customers.list({
//       email: data.email,
//     });
//     if (!customers.data.length) {
//       return { res: "NoCustomer" };
//     }
//     const paymentMethods = await stripe.paymentMethods.list({
//       customer: customers.data[0].id,
//       type: "card",
//     });
//     if (!paymentMethods.data.length) {
//       return { res: "NoPaymentMethod" };
//     } else {
//       return { res: paymentMethods.data[0] };
//     }
//   }
// );

exports.createVerificationSession = functions.https.onCall(async (data, context) => {
  const customerId = data.user_id;
  const verification = await stripe.identity.verificationSessions.create({
    type: 'document',
    metadata: {
      user_id: customerId,
    },
    return_url: `https://stripe.com/docs/api/identity/verification_sessions?vi=${customerId}`
  });
  return { response: verification };
});

exports.retrieveVerificationSession = functions.https.onCall(async (data, context) => {
  const vsessionId = data.verificationSessionId;
  const verification = await stripe.identity.verificationSessions.retrieve(
    vsessionId   
  );

  // admin
  //     .firestore()
  //     .collection('users')
  //     .where('verificationSessionId', '==', vsessionId)
  //     .get()
  //     .then(snap => {
  //         let batch = admin.firestore().batch();
  //         snap.forEach(x => {
  //           console.log(x.verificationSessionId);

  //           const ref = admin 
  //               .firestore()
  //               .collection('users')
  //               .doc(x.id);
  //           batch.update(ref, { idverify: verification.status });                     
  //         });
  //         // Commit and return the batch
  //         return batch.commit();
  //     })
  //     .then(() => {
  //         response.send({result: 'success'});
  //     })
  //     .catch(error => {
  //         response.status(500).send(error);
  //     });

  return { response: verification };
});

exports.updateVerificationStatus = functions.https.onCall(async (data, context) => {
  admin
      .firestore()
      .collection('users')
      //.where('index', '==', request.index)
      .get()
      .then(snap => {
          let batch = admin.firestore().batch();
          snap.forEach(x => {
            console.log(x.verificationSessionId);
              
            if (x.verificationSessionId) {
              const verificationessionId = x.verificationSessionId;
              const verification = stripe.identity.verificationSessions.retrieve({
                verificationessionId,
              });

              const ref = admin 
                  .firestore()
                  .collection('users')
                  .doc(x.id);
              batch.update(ref, { idverify: verification.status });

            }              
          });
          // Commit and return the batch
          return batch.commit();
      })
      .then(() => {
          response.send({result: 'success'});
      })
      .catch(error => {
          response.status(500).send(error);
      });
});

// exports.scheduledFunctionCrontab = functions.pubsub.schedule('every 5 minutes')
//   .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
//   .onRun((context) => {
//     admin
//       .firestore()
//       .collection('users')
//       //.where('index', '==', request.index)
//       .get()
//       .then(snap => {
//           let batch = admin.firestore().batch();
//           snap.forEach(x => {
//             console.log(x.verificationSessionId);
              
//             if (x.verificationSessionId) {
//               const verificationessionId = x.verificationSessionId;
//               const verification = stripe.identity.verificationSessions.retrieve({
//                 verificationessionId,
//               });

//               const ref = admin 
//                   .firestore()
//                   .collection('users')
//                   .doc(x.id);
//               batch.update(ref, { idverify: verification.status });

//             }              
//           });
//           // Commit and return the batch
//           return batch.commit();
//       })
//       .then(() => {
//           response.send({result: 'success'});
//       })
//       .catch(error => {
//           response.status(500).send(error);
//       });

//     console.log('This will be run every 5 minutes!');
//   return null;
// });


exports.createPaymentMethod = functions.https.onCall(async (data, context) => {
  // const customers = await stripe.customers.list({
  //   email: data.email,
  // });
  const customer = await stripe.customers.create({
    email: data.email,
  });
  // const paymentMethods = await stripe.paymentMethods.list({
  //   customer: customers.data[0].id,
  //   type: "card",
  // });
  // if (paymentMethods.data[0]) {
  //   return { error: "Duplicate" };
  // }
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: data.cardDetails,
  });
  const attachPaymentMethod = await stripe.paymentMethods.attach(
    paymentMethod.id,
    {      
      customer: customer.id,
    }
  );

  const updateCustomer = await stripe.customers.update(
    customer.id,
    {      
      invoice_settings: {
        default_payment_method: paymentMethod.id
      }     
    }
  );
  return { 
    customerId: customer.id,    
    paymentMethodId: attachPaymentMethod.id 
  };
});

exports.updatePaymentMethod = functions.https.onCall(async (data, context) => {

  const paymentMethods = await stripe.paymentMethods.list({
    customer: data.customerId,
    type: "card",
  });
  if (paymentMethods.data.length > 0) {
    const detachPaymentMethod = await stripe.paymentMethods.detach(paymentMethods.data[0].id);
  }  
  
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: data.cardDetails,
  });
  const attachPaymentMethod = await stripe.paymentMethods.attach(
    paymentMethod.id,
    {      
      customer: data.customerId
    }
  );
  
  const updateCustomer = await stripe.customers.update(
    data.customerId,
    {      
      invoice_settings: {
        default_payment_method: paymentMethod.id
      }     
    }
  );
  return { paymentMethodId: attachPaymentMethod.id };
});

exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  const customers = await stripe.customers.list({
    email: data.email,
  });
  if (!customers.data[0]) {
    return { error: "NoCustomer" };
  }
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customers.data[0].id,
    type: "card",
  });
  if (!paymentMethods.data[0]) {
    return { error: "NoPaymentMethod" };
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount: data.amount,
    currency: "usd",
    payment_method_types: ["card"],
    payment_method_options: {
      card: {
        request_three_d_secure: "automatic",
      },
    },
    payment_method: paymentMethods.data[0].id,
    customer: customers.data[0].id,
    confirm: true,
  });
  return {
    clientKey: paymentIntent.client_secret,
    paymentMethodId: paymentMethods.data[0].id,
  };
});

// exports.updatePaymentMethod = functions.https.onRequest(
//   async (request, response) => {
//     const paymentMethod = await stripe.paymentMethods.update(
//       "pm_1JtOMY2eZvKYlo2Ck8FTZRza",
//       { metadata: { order_id: "6735" } }
//     );
//   }
// );
