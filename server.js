import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, {
    verifyRequest
}
from "@shopify/koa-shopify-auth";
import graphQLProxy, {
    ApiVersion
}
from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import * as handlers from "./handlers/index";
import * as admin from "firebase-admin";
import axios from "axios";
const var_dump = require('var_dump');
const fs = require('fs');
const util = require("util");

const readFile = util.promisify(fs.readFileSync);

var bodyParser = require('koa-body-parser');
var serviceAccount = require("../firebaseServiceKey.json");
const cors = require('@koa/cors');

var loginToken = false;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sales-pop.firebaseio.com",
});
var token;
var shopName;
var userid;

async function getShopData(shop, accessToken) {
    var config = {
        headers: {
            "X-Shopify-Access-Token": accessToken,
        },
    };

    var res = await axios.get(
        "https://" + shop + "/admin/api/2020-04/shop.json",
        config
    );

    return await res.data;
}

async function setupWebsite(shop, accessToken) {
    var config = {
        headers: {
            "X-Shopify-Access-Token": accessToken,

        },
    };
   

    try {
        var res = await axios.post(
            "https://" + shop + "/admin/api/2020-07/script_tags.json", {
                script_tag: {
                    event: "onload",
                    src: "https://a02fb2bb2238.ngrok.io/asset/" + shop + ".js",

                },
            },
            
            config
        );

    }

    catch (err) {
        console.log(err);
    }

    //var_dump(res.data);

    console.log("step3");
    //var_dump(res);

    return true;
}

dotenv.config();
const port = 80;
const dev = process.env.NODE_ENV !== "production";
const app = next({
    dev,
});
const handle = app.getRequestHandler();
const {
    SHOPIFY_API_SECRET,
    SHOPIFY_API_KEY,
    SCOPES
} = process.env;
app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();

    server.use(cors());
    server.use(
        session({
                sameSite: "none",
                secure: true,
            },
            server
        )
    );
    server.keys = [SHOPIFY_API_SECRET];
    server.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET,
            scopes: [SCOPES],

            async afterAuth(ctx) {
                //Auth token and shop available in session
                //Redirect to shop upon auth
                const {
                    shop,
                    accessToken
                } = ctx.session;
                ctx.cookies.set("shopOrigin", shop, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                });
                ctx.cookies.set("accessToken", accessToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                });
              
                var shopData = await getShopData(shop, accessToken);

                var customerEmail = shopData.shop.email;
                var myshopify = shopData.shop.myshopify_domain;
                var domain = shopData.shop.domain;
                console.log( customerEmail);

                var site = {

                    accessToken: accessToken,
                    email: customerEmail,
                    myshopify: myshopify,
                    domainName: domain

                };
                var data = {
                    sites: site,
                };

                var password = 'test123';
                var mainUid;
                var newUser = await admin.auth().getUserByEmail(customerEmail)
                    .then(function(userRecord) {
                        // See the UserRecord reference doc for the contents of userRecord.
                            console.log( 'hello='+ userRecord.uid);
                        return userRecord.uid;
                    })
                    .catch(function(error) {
                       
                        var checkUser = 1;
                        return checkUser;
                    });
          
                if (newUser == 1) {
                      var data=  await  admin.auth().createUser({
                            email: customerEmail,
                            emailVerified: false,
                             password: password,
                             disabled: false
                        })

                        .then((userRecord)=> {
                            console.log( 'hello3'+userRecord.uid);
                            
                                token=accessToken;
                                shopName=shop;
                                 
                                var currentDb = admin.database().ref('data/' + userRecord.uid+'/sites');
                                        
                                var eventRef = currentDb.push(site);
                                var pushKey=eventRef.key;
                                var useUid= userRecord.uid;
                              console.log(pushKey);
                              	
                             console.log(useUid);
                             var impData={
                             	pushKey,
                             	useUid
                             }
                             //console.log(impData);
                                return impData
                             })
                        .catch(function(error) {
                            console.log('Error creating new user:', error);
                        });
                        
                        console.log(data);
                        var readData=Object.values(data);
                        mainUid=readData[1];
                        console.log(readData);
                         const salesPop = await  admin.database().ref(`defaultData/salesPop/`).once('value').then(function(snapshot) {
  																	 return (snapshot.val() ) || false;
  																		});
														
															await  admin.database().ref(`data/`+readData[1]+`/salesPop/`+readData[0]).update(salesPop);
                }
                else {
                    token=accessToken;
                    shopName=shop;
                    console.log( 'hello2='+newUser);
                    mainUid=newUser;
                    
                   
                var updatekey = await admin.database().ref('data/' + newUser+'/sites').once("value")
            .then(function(snapshot) {
                var firstkey=Object.keys(snapshot.val());
                console.log("helo "+firstkey[0]);
                // return snapshot.val();
                return firstkey[0];
            });
            
            
            console.log(updatekey + " update key");
        var currentDb = admin.database().ref('data/' + newUser+'/sites/'+updatekey);
                    
                    var eventRef = currentDb.update(site);
                    
                   

                } 
                     
                // console.log(createUser);
                // var userRecord = await admin.auth().getUserByEmail(customerEmail);
                // console.log(userRecord.uid);

          

                console.log("Logging Response ");
                console.log(customerEmail);
                console.log(ctx.cookies.get("accessToken"));
                setupWebsite(shop, accessToken);
                console.log('mainUid = '+mainUid);
                userid=mainUid;
                loginToken = await admin.auth().createCustomToken(mainUid);
                // console.log('loginToken ='+loginToken);
                // ctx.redirect("https://app.honeycom.co/shopify/setup/" + loginToken);
                //   ctx.redirect("https://app.honeycom.co/shopify/setup/" );
                ctx.redirect("http://192.168.0.4:8000/#/shopify/setup/"+loginToken);
                
                
                
                // ctx.redirect("/");
            },
        })
    );
    server.use(
        graphQLProxy({
            version: ApiVersion.October19,
        })
    );
    router.get("/auth/*", () => {
        return true;
    }, async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
    });

    server.use(bodyParser());
    //event registr Api 
    router.post('/api/events', (ctx) => {

        var body = ctx.request.body;
        var returnBody = {
            status: true

        };
        body.eventTime = new Date().getTime();
        var siteId = body.siteId;
        var type1 = body.type;
        var eventObject = {

            value: body.values,

            time: body.eventTime,
            type: body.type
        }

        var currentDb = admin.database().ref('events');
        var siteRef = currentDb.child(siteId);
        var typeRef = siteRef.child(type1);
        var eventRef = typeRef.push().set(eventObject);

        // returnBody.eventId=eventRef.key;

        console.log(body);
        ctx.respond = true;
        ctx.body = returnBody;
        ctx.res.statusCode = 200
    });
    
    

    // router.post('/api/notification/edit',(ctx) => {

    // 	var body  = ctx.request.body ;
    //         var designBody = {
    // 		status  : true

    // 	};
    //   var designObject={
    //     popStyle: body.popStyle,
    //     popShadow:body.popShadow,
    //     popSubTitle:body.popSubTitle,
    //     siteId: body.siteId
    //   }
    // var currentDb = admin.database().ref('data/unIkYIcGLKV4yrG3EzeJ4uV6sWP2/salesPop/design/-MAMzJpggY7bqwUDuFp8');
    //   var eventRef = currentDb.update(designObject);

    // designBody.designId=eventRef.key;

    // 	ctx.respond = true;
    //   	ctx.body = designBody;
    // 	ctx.res.statusCode = 200
    //   });

    //   router.post('/api/notification/display',(ctx) => {

    // 	var body  = ctx.request.body ;
    //         var designBody = {
    // 		status  : true

    // 	};

    // var db = admin.database();
    // var ref = db.ref("data/unIkYIcGLKV4yrG3EzeJ4uV6sWP2/salesPop/design/MAMzJpggY7bqwUDuFp8");

    // // Attach an asynchronous callback to read the data at our posts reference
    // ref.on("value", function(snapshot) {
    //   console.log(snapshot.val());
    // }, function (errorObject) {
    //   console.log("The read failed: " + errorObject.code);
    // });

    // 	ctx.respond = true;
    //   	ctx.body = designBody;
    // 	ctx.res.statusCode = 200
    //   });

    router.post(('/api/noteDesign/data'), async(ctx)=>{
      var body= ctx.request.body;
      var displayBody={
        status:true
      };
       var uid=userid;
       console.log(uid);

      var salesPopId = await  admin.database().ref('data/'+uid+'/salesPop').once('value').then(function(snapshot){
             var firstkey=Object.keys(snapshot.val());
              
               
                return firstkey[0];

    });
    console.log(salesPopId);
    
       var currentDb = await  admin.database().ref('data/'+uid+'/salesPop/'+salesPopId+'/pops/recentActivity/design').once('value').then(function(snapshot){
             var data=snapshot.val();
              console.log(data)
               
                return data;

    });
    displayBody.evetKey=currentDb;

      ctx.respond=true;
      ctx.body=displayBody;
      ctx.res.statusCode=200;
    } );
    
    
    
    router.post(('/api/timeInterval'), async (ctx) => {
        var body = ctx.request.body;
        var displayBody = {
            status: true
        };
        // var accessToken;
     var uid=userid;
       console.log(uid);
 var timeSetting = await  admin.database().ref('data/'+uid+'/timeSetting').once('value').then(function(snapshot){
             var Data=snapshot.val();
               return Data;

    });
displayBody.timesetting=timeSetting
        ctx.respond = true;
        ctx.body = displayBody;
        ctx.res.statusCode = 200;
    });
    
    

    router.post(('/api/access'), async (ctx) => {
        var body = ctx.request.body;
        var displayBody = {
            status: true
        };
        // var accessToken;
     var token=userid;
         displayBody.userId=token;

        // accessToken = await admin.database().ref('data/unIkYIcGLKV4yrG3EzeJ4uV6sWP2/sites/-M7InfkVrN8dww8dgUsd').once("value")
        //     .then(function(snapshot) {
        //         return snapshot.val().accessToken;
        //     });
       
        // // console.log(accessToken);
        // var_dump(accessToken);

        ctx.respond = true;
        ctx.body = displayBody;
        ctx.res.statusCode = 200;
    });

    router.post(('/api/noOfCart'), async (ctx) => {
        var body = ctx.request.body;
        var displayBody = {
            status: true
        };
        
        // var shopName = await admin.database().ref('data/unIkYIcGLKV4yrG3EzeJ4uV6sWP2/sites/-M7InfkVrN8dww8dgUsd').once("value")
        //     .then(function(snapshot) {
        //         return snapshot.val().shop;
        //     });
            var shop=shopName;
        var dateObj = new Date();

        // subtract one day from current time                           
        dateObj.setDate(dateObj.getDate() - 1);
        var yesterDay = dateObj.getTime();
        var siteId = shop.replace('.myshopify.com', '');
        const currentData = await admin.database().ref('events/' + siteId + '/addToCart').orderByChild("time").startAt(yesterDay).endAt(
            new Date().getTime()).once("value").then((snapshot) => {
            return snapshot.numChildren();
        });

        // console.log(accessToken);
        // var_dump(accessToken);

        displayBody.count = currentData;

        ctx.respond = true;
        ctx.body = displayBody;
        ctx.res.statusCode = 200;
    });

    router.post(('/api/noOfOrder'), async (ctx) => {
        var body = ctx.request.body;
        var displayBody = {
            status: true
        };
      
    var shop=shopName;
    var accessToken=token;
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hours = d.getHours();
        var minute = d.getMinutes();
        var seconds = d.getSeconds();
        var currentDate = year + "-" + month + "-" + day + "T" + hours + ":" + minute + ":" + seconds;
        var dateObj = new Date();

        // subtract one day from current time                           
        dateObj.setDate(dateObj.getDate() - 1);
        var yesterDay = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate() + "T" + hours + ":" + minute +
            ":" + seconds;

        var config = {
            method: 'get',
            url: 'https://' + shop + '/admin/api/2020-07/orders/count.json?status=any&updated_at_min=' + yesterDay +
                '&updated_at_max=' + currentDate,
            headers: {
                'X-Shopify-Access-Token': accessToken,

            }
        };

        var count = await axios(config)
            .then(function(response) {
                // console.log(JSON.stringify(response.data));
                return response.data.count;
            })
            .catch(function(error) {
                console.log(error);
            });

        displayBody.count = count;

        ctx.respond = true;
        ctx.body = displayBody;
        ctx.res.statusCode = 200;
    });
    
    
    
     router.post(('/api/noOfCheckout'), async (ctx) => {
        var body = ctx.request.body;
        var displayBody = {
            status: true
        };
       
    var shop=shopName;
    var accessToken=token;
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hours = d.getHours();
        var minute = d.getMinutes();
        var seconds = d.getSeconds();
        var currentDate = year + "-" + month + "-" + day + "T" + hours + ":" + minute + ":" + seconds;
        var dateObj = new Date();

        // subtract one day from current time                           
        dateObj.setDate(dateObj.getDate() - 1);
        var yesterDay = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate() + "T" + hours + ":" + minute +
            ":" + seconds;

        var config = {
            method: 'get',
            url: 'https://' + shop + '/admin/api/2020-07/checkouts/count.json?status=any&updated_at_min=' + yesterDay +
                '&updated_at_max=' + currentDate,
            headers: {
                'X-Shopify-Access-Token': accessToken,

            }
        };

        var count = await axios(config)
            .then(function(response) {
                // console.log(JSON.stringify(response.data));
                return response.data.count;
            })
            .catch(function(error) {
                console.log(error);
            });

        displayBody.count = count;

        ctx.respond = true;
        ctx.body = displayBody;
        ctx.res.statusCode = 200;
    });

    router.post(("/api/orders"), async (ctx) => {
        var body = ctx.request.body;
        var displayBody = {
            status: true
        };

        // var accessToken;

        // accessToken = await admin.database().ref('data/unIkYIcGLKV4yrG3EzeJ4uV6sWP2/sites/-M7InfkVrN8dww8dgUsd').once("value")
        //     .then(function(snapshot) {
        //         return snapshot.val().accessToken;
        //     });
        // var shopName = await admin.database().ref('data/unIkYIcGLKV4yrG3EzeJ4uV6sWP2/sites/-M7InfkVrN8dww8dgUsd').once("value")
        //     .then(function(snapshot) {
        //         return snapshot.val().shop;
        //     });
        // console.log(accessToken);
        //var_dump(accessToken);
        var shop=shopName;
    var accessToken=token;

        var config = {
            method: 'get',
            url: 'https://'+shop+'/admin/api/2020-04/orders.json',
            headers: {
                'X-Shopify-Access-Token': accessToken,
                'Cookie': '__cfduid=da48a8274714c0ba33c499b1c5cef50671593005626; request_method=POST'
            }
        };

        var orderData = await axios(config)
            .then(function(response) {
                //console.log(JSON.stringify(response.data));
                //	var_dump(response.data.orders);
                var orders = response.data.orders;
                var keyOrders = orders.map(or => {
                    var id = or.id;
                    var updatedAt = or.updated_at;
                    var item = or.line_items;
                    var itemTitle = item.map(i => {
                        //console.log(i.title);
                        return i.title;
                    });

                    var orderDetails = {};
                    orderDetails.id = id;
                    orderDetails.updateAt = updatedAt;
                    orderDetails.products = itemTitle;

                    return orderDetails;

                });

                console.log(keyOrders);
                return keyOrders;
            })
            .catch(function(error) {
                console.log(error);
            });

        //var_dump(orderData)

        displayBody.order = orderData;

        ctx.respond = true;
        ctx.body = displayBody;
        ctx.res.statusCode = 200;
    });

    router.post(("/api/notification/products"), async (ctx) => {
        var body = ctx.request.body;
        var displayBody = {
            status: true
        };

        // var accessToken;

        // accessToken = await admin.database().ref('data/unIkYIcGLKV4yrG3EzeJ4uV6sWP2/sites/-M7InfkVrN8dww8dgUsd').once("value")
        //     .then(function(snapshot) {
        //         return snapshot.val().accessToken;
        //     });
        // var shopName = await admin.database().ref('data/unIkYIcGLKV4yrG3EzeJ4uV6sWP2/sites/-M7InfkVrN8dww8dgUsd').once("value")
        //     .then(function(snapshot) {
        //         return snapshot.val().shop;
        //     });
        // console.log(accessToken);
        //var_dump(accessToken);
         var shop=shopName;
    var accessToken=token;

        var config = {
            method: 'get',
            url: 'https://' + shop + '/admin/api/2020-04/orders.json',
            headers: {
                'X-Shopify-Access-Token': accessToken,
                'Cookie': '__cfduid=da48a8274714c0ba33c499b1c5cef50671593005626; request_method=POST'
            }
        };

        var orderData = await axios(config)
            .then(function(response) {
                //console.log(JSON.stringify(response.data));
                var keyorder = response.data.orders[0];
                var orders = Object.values(response.data.orders[0]);
                var id = keyorder.id;
                var orderDate = keyorder.updated_at;
                var product = keyorder.line_items[0];
                var productName = product.title;
                var productId = product.product_id;
                var customer = keyorder.customer.default_address;

                var orderDetails = {};
                orderDetails.id = id;
                orderDetails.updateAt = orderDate;
                orderDetails.productName = productName;
                orderDetails.name = customer.name;
                // orderDetails.address = customer.city + ", " + customer.province;
                orderDetails.address = customer.city;
                orderDetails.productId = productId;

                //   return orderDetails;

                // });

                // console.log(orderDetails);
                return orderDetails;
            })
            .catch(function(error) {
                console.log(error);
            });

        var productId = orderData.productId;

        var config1 = {
            method: 'get',
            url: 'https://' + shop + '/admin/api/2020-07/products/' + productId + '/images.json',
            headers: {
                'X-Shopify-Access-Token': accessToken,

            }
        };

        var productImage = await axios(config1)
            .then(function(response) {
                // console.log(JSON.stringify(response.data));
                var image = response.data.images;
                       var data=[];
                        console.log(image.length);
                        for(var i=0; i<image.length;i++)
                        {
                            data.push(image[i].src);
                        }

                return data;
            })
            .catch(function(error) {
                console.log(error);
            });

        displayBody.order = orderData;
        displayBody.productImage = productImage;
        ctx.respond = true;
        ctx.body = displayBody;
        ctx.res.statusCode = 200;
    });

    router.post('/api/notification/display', async (ctx) => {

        var body = ctx.request.body;
        var designBody = {
            status: true

        };

        var events;
        var type = "view";

        events = await admin.database().ref('events').orderByChild("type").equalTo("view").once("value").
        then(function(snapshot) {

            return snapshot.val();
        });

        var_dump(events);

        var config = {
            method: 'get',
            url: 'https://honeycom-ecommerce.myshopify.com/admin/api/2020-04/orders.json',
            headers: {
                'X-Shopify-Access-Token': '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',
                'Cookie': '__cfduid=da48a8274714c0ba33c499b1c5cef50671593005626; request_method=POST'
            }
        };

        axios(config)
            .then(function(response) {
                console.log(JSON.stringify(response.data));
                var_dump(response.data);
            })
            .catch(function(error) {
                console.log(error);
            });

        //     var ref=   admin.database().ref("events");
        // ref.orderByChild("type").equalTo("view").on("child_added", function(snapshot) {

        //   console.log( snapshot.val().siteId);

        // });
        //console.log(accessToken);
        //var_dump(accessToken)

        ctx.respond = true;
        ctx.body = designBody;
        ctx.res.statusCode = 200
    });

    router.get(('/asset/*.js'), async (ctx) => {
        var body = ctx.request.body;
        var path = ctx.request.path;
        var removePath = path.replace('/asset//', '');
        // console.log(removePath);
        var siteId = removePath.replace('.myshopify.com.js', '');
        var siteId2 = siteId.replace('/asset/', '');
        // console.log(siteId);

        var readData = "";
        readData = fs.readFileSync('./server/pageload.js', 'utf8');
        var displayBody = "var siteId = '" + siteId2 + "' ;" + readData;
        // console.log("check read data value");
        // console.log(displayBody);

        // console.log(__filename);
        // console.log(ctx.request.path);

        ctx.respond = true;

        ctx.body = displayBody;
        ctx.res.statusCode = 200;
    });

    server.use(router.allowedMethods());
    server.use(router.routes());

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
