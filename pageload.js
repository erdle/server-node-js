jQuery(document).ready(function($) {
    var didShowSalesPop = false;
    /*
    { 
    	Default Functionality Code */
    jQuery("body").append(`
	<style>
	
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

	.vin-salespop{
	  position : fixed ;
	  top : 0px;
	   margin-left: 10px;
	  
	  border: 1px solid #eee ;
	   padding-top: 0.3rem;
	   
	  border-radius : 10px ;
	  box-shadow: 5px 4px 10px #b7b7b7;
font-family: 'Inter', sans-serif;
	  transition: all 500ms ;
	  background: #fff ;
	  z-index: 1000 ;
	  max-width: 350px ;

	  transition: all 800ms ;
	}
	
	.vin-salespop.active{
	  bottom: 20px ;
	}
	.hide{
	    left:-100px;
	}
	.hieghtClass{
	   max-height:100px;
	}
	
	
	.vin-salespop.slide-left{
	  left: -9999px ;
	  bottom: 20px ;
	}
	.vin-salespop.slide-left.active{
	  left: 0px ;
	}
	

	.vin-salespop .vsp-img{
	  width : 100% ;
	  height:80px;
	  border-radius : 5px ;
	}
	.vin-salespop .vsp-data{
	  float:right
	  align-items : left ;
	  min-height : 65px ;
	  padding-right: 10px ;
	}
	.vin-salespop.no-img .vsp-data{
	  min-height: 50px  ;
	}
	.vin-salespop.no-img .vsp-img{
	  display: none;
	}
	

	
	.vin-salespop .vsp-subtitle.blink{
	  color : #999 ;
	  animation:blinkingText 1.2s infinite;
	}

	
	
	.vin-salespop i{
	  font-style: normal !important ;
	}
	
	@keyframes blinkingText{
		0%{     color: #bbb;    }
		49%{    color: #bbb; }
		60%{    color: #333; }
		99%{    color: #333;  }
		100%{   color: #bbb;    }
	}
	
	
	
	#leftbox { 
                float:left;  
                padding-top:5px;
                padding-left:10px;
                width:25%; 
                height:100%; 
            } 
            
            #rightbox{ 
                float:right; 
                   padding-top:5px;
               width:70%; 
                height:100%; 
            } 
        .vsp-line{
    	     color: #333;
    	     font-size:15px;
    	font-weight : 700;
             width:100%;
             height:30px;
              padding-top:5px;
    
            }
            .name-input{
              float:left;
              max-width:70%;
            }
            	.vsp-location{
            	    float:left;
                    max-width:25%;
                }
            	.vin-salespop .vsp-title{
                     display : block ;
                     color: #333;
                    align-items : left ;
                     width:100%;
                     height:30px;
                   
                }
                .product-input{
                     font-size:12px;
    	     font-weight : 450;
                }
            	.note-time{
	            width:100%;
                height:30px;	        
	        	}
	        		.vin-salespop .vsp-time{
            	  font-style : italic ;
            
                 font-size:12px;
                float:left;
               max-width:40%;
	}
                  .vin-salespop .vsp-subtitle{
        	 
        	  font-family: 'Poppins', sans-serif;
        	  font-weight :600;
              font-size:12px;
              float:right;
              width:70%; 
              
              color: #0050C8;
            }   
    
	</style>
		<div class='vin-salespop  hide hieghtClass' id="target">
		
                <div id = "leftbox"> 
                   <img class='vsp-img' src='#' >
                </div>  
                <div id = "rightbox"> 
                     <div class='vsp-line '>
                         <i class='  name-input' ></i> <span class='vsp-location'></span>
                     </div>
                       <span class='vsp-title'> 
                        <i class=' product-input'> </i>
 
                      </span>
                      <div class='note-time'>
                     
                        <span class='vsp-time'></span>
                        <span class='vsp-subtitle'>

<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 468.293 468.293" style="enable-background:new 0 0 468.293 468.293;" xml:space="preserve" width="12px" height="12px">
<circle style="fill:#0050C8;" cx="234.146" cy="234.146" r="234.146"/>
<polygon style="fill:#EBF0F3;" points="357.52,110.145 191.995,275.67 110.773,194.451 69.534,235.684 191.995,358.148 
	398.759,151.378 "/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
 verified by  Compello</span>
                     </div>
                </div> 
    	</div>
    	
    	
    	
    	
    
	
`);

                         
    function showPopup(popData = {}, popSettings = {}) {
        var {
            name,
            product,
            image,
            location,
            timeAgo
        } = popData;
       
        var {
            slideFrom,
            randomImages,
            hideAfter,
            subtitle,
            blinkSubtitle,
            
        } = popSettings;
        while (timeAgo === 0)
        {
            timeAgo = Math.floor(Math.random() * 11);
        }
        $(".vin-salespop").removeClass("hide");
       
       
            //   console.log(image);
      
         if(Array.isArray(image)){
                var i = 0;
        var intervalId = setInterval(function() {
            //  console.log( " is array image "+ Array.isArray(image));
   $(".vin-salespop .vsp-img").attr("src", image[i]);
  if (i == (image.length - 1)) {
    i = 0;
    image=false;
   

  } else {
    i++;
  }
}, 2500)


 }
 
 
 else{
    //   console.log( " is not array image "+ Array.isArray(image));
     
              $(".vin-salespop .vsp-img").attr("src", image);
         }
        $(".vin-salespop .name-input").text(name);
        // $(".vin-salespop .product-input").text(product);
         $(".vin-salespop .product-input").html(product);
        $(".vin-salespop .vsp-subtitle").text(subtitle);
        $(".vin-salespop .vsp-location").text(location);
        $(".vsp-time").text(timeAgo);
        // if (!image && !randomImages)
        //     $('.vin-salespop').addClass('no-img');
        // else if (image)
        // debugger;
        // console.log(blinkSubtitle);
      
        // console.log(image);
        if (blinkSubtitle)
            $(".vin-salespop .vsp-subtitle").addClass('blink');
        if (slideFrom)
            $(".vin-salespop").addClass("slide-" + slideFrom);
        $(".vin-salespop").addClass("active");
        setTimeout(() => {
            $(".vin-salespop").removeClass("active");
        }, hideAfter);
    }
    
    
     function showPopup1(popData = {}, popSettings = {}) {
        var {
            name,
            product,
            image,
            location,
            timeAgo
        } = popData;
       
        var {
            slideFrom,
            randomImages,
            hideAfter,
            subtitle,
            blinkSubtitle,
            
        } = popSettings;
        while (timeAgo === 0)
        {
            timeAgo = Math.floor(Math.random() * 11);
        }
        $(".vin-salespop1").removeClass("hide");
       
       
            //   console.log(image);
      
         if(Array.isArray(image)){
                var i = 0;
        var intervalId = setInterval(function() {
            //  console.log( " is array image "+ Array.isArray(image));
   $(".vin-salespop .vsp-img").attr("src", image[i]);
  if (i == (image.length - 1)) {
    i = 0;
   

  } else {
    i++;
  }
}, 2500)


 }
 
 
 else{
    //   console.log( " is not array image "+ Array.isArray(image));
     
              $(".vin-salespop .vsp-img").attr("src", image);
         }
        $(".vin-salespop .name-input").text(name);
        // $(".vin-salespop .product-input").text(product);
         $(".vin-salespop .product-input").html(product);
        $(".vin-salespop .vsp-subtitle").text(subtitle);
        $(".vin-salespop .vsp-location").text(location);
        $(".vsp-time").text(timeAgo);
        // if (!image && !randomImages)
        //     $('.vin-salespop').addClass('no-img');
        // else if (image)
        // debugger;
        // console.log(blinkSubtitle);
      
        // console.log(image);
        if (blinkSubtitle)
            $(".vin-salespop .vsp-subtitle").addClass('blink');
        if (slideFrom)
            $(".vin-salespop").addClass("slide-" + slideFrom);
        $(".vin-salespop").addClass("active");
        setTimeout(() => {
            $(".vin-salespop").removeClass("active");
        }, hideAfter);
    }
    
   
    
    
    



 var popInterVal = 10000;

    
        var setting = {
  
  "url": "https://a02fb2bb2238.ngrok.io/api/timeInterval",
  "method": "POST",
  
}

$.ajax(setting).done(function (response) {
//   console.log( response.timesetting.pop);
  var interval=  response.timesetting.pop;
  popInterVal=(interval *1000);
//   console.log(popInterVal);
  
});



   
    async function checkIfNewProduct() {
        // debugger;
        didShowSalesPop = false;
        var popData = {
            name: 'Vinit Patil',
            product: '6 Inch Mattress',
            location: '',
            timeAgo: '4',
            image: '',
        };
        var popSettings = {
            slideFrom: 'left',
            randomImages: true,
            hideAfter: 10000,
            // subtitle: '',
            blinkSubtitle: false,
            
        };





         var setting = {
  
  "url": "https://a02fb2bb2238.ngrok.io/api/timeInterval",
  "method": "POST",
  
}

$.ajax(setting).done(function (response) {
//   console.log( response.timesetting.interval);
  var interval=  response.timesetting.interval;
  popSettings.hideAfter=(interval *1000);
//   console.log( popSettings.hideAfter);
  
});





        var settings1 = {

  "url": "https://a02fb2bb2238.ngrok.io/api/noteDesign/data",
  "method": "POST",
  "timeout": 0,
  
}

$.ajax(settings1).done(function (response) {
//   console.log(response);
  data=response.evetKey.subtitleEffect;
//   console.log( data) ;
  if(data == "blink"){
      popSettings.blinkSubtitle=true;
      
  }
});


        var settings = {
            "url": "https://a02fb2bb2238.ngrok.io/api/notification/products",
            "method": "POST",
            "timeout": 0,
        };
        await $.ajax(settings).done(function(response) {

            var keys = response.order;
            var productImage=[];
            var proimage;
            // console.log(Array.isArray(response.productImage));
            // console.log(productImage[0]);
                    
            if(Array.isArray(response.productImage)){
                        
                  productImage.push(response.productImage);
                //   console.log(productImage);
                
            }
            // else{
            //     productImage.push(response.productImage);
            //     // console.log(productImage);
            // }
            var id = keys.id;
            var orderTime = keys.updateAt;

            var product = keys.productName;
            var custName = keys.name;
            var custAddress = keys.address;
            var getCookies = document.cookie.split(";");

            function findValue(getCookies) {
                return getCookies.startsWith(" id1=");
            }

            function findEvent(getCookies) {
                return getCookies.startsWith(" event=");
            }
            function findSug(getCookies) {
                return getCookies.startsWith(" sug=");
            }

            var c1 = getCookies.find(findValue);
            var lenght1 = getCookies.length;
            var event = 0;
            var sug=0;
            var sug1;
            var value1;
            var event1;
            var e1 = getCookies.find(findEvent);
            //console.log(getCookies);
            if (typeof c1 === 'undefined') {
                value1 = 'undefined';
            } else {
                value1 = c1.split("=")[1];
            }
            // console.log(value1 + "=" + id);

            if (typeof e1 === 'undefined') {
                event1 = 'undefined';
            } else {
                event1 = e1.split("=")[1];
            }
            // console.log(event1 + "=" + event);

        var s1=getCookies.find(findSug);
 if (typeof s1 === 'undefined') {
                sug1 = 'undefined';
            } else {
                sug1 = s1.split("=")[1];
            }
        

            var updatedAt = Math.abs(new Date() - new Date(orderTime)) / 60000;
            var updatedAt1 = Math.abs(new Date() - new Date(orderTime)) / 36e5;
            var updatedAt3 = Math.round((new Date() - new Date(orderTime)) / 60000) + " mins ago";
            if (updatedAt > 30 && updatedAt1 <= 24) {
                updatedAt3 = Math.round((new Date() - new Date(orderTime)) / 36e5) + " Hours ago ";
            } else if (updatedAt > 24) {
                updatedAt3 = new Date().getDate() - new Date(orderTime).getDate() + " days ago";
            }
            var getDateInMinute = updatedAt3;

            if (value1 == 'undefined') {
                document.cookie = "id1=" + id;
              
                 
                // console.log(popData.image);
               
                   
                     popData.product = "purchased  " + product;
                    popData.name = custName ;
                     popData.timeAgo = getDateInMinute;
                    
                  
                        popData.image =productImage[0];
                            // console.log(popData.image);
                    showPopup(popData, popSettings);
                
                
                // popData.image = productImage;
                
                

                 
            } else
            {
                if (id == value1) {


                    // console.log(value1 + " defualt pop");
                    
                    
                  
                    	
                   
                    if (event1 == 'undefined') {
                        
                        document.cookie = "event=" + event;
                        // console.log("order "+ event1);
                        
                        var settings = {
                            "url": "https://a02fb2bb2238.ngrok.io/api/noOfOrder",
                            "method": "POST",
                            "timeout": 0,
                        };

                        $.ajax(settings).done(function(response1) {

                            //  console.log(response1);

                            var noOfEvents = response1.count;
                            popData.product = "last 24 hours " +noOfEvents;
                            popData.name = " No of order in  "  ;
                            popData.timeAgo = " ";
                            popData.location = " ";
                            // popData.image = productImage[0];
                            popData.image="https://f7918d3f2086.ngrok.ioresources/images/order.png";
                            // console.log(popData.image);
                                
                            showPopup(popData, popSettings);

                        });

                    } else if (event == event1) {
                        var event2 = 1;
                        document.cookie = "event=" + event2;
                        //   console.log("cart " +event1);
                        var settings1 = {
                            "url": "https://a02fb2bb2238.ngrok.io/api/noOfCart",
                            "method": "POST",
                            "timeout": 0,
                        };

                        $.ajax(settings1).done(function(response1) {


                            var noOfEvents = response1.count;
                            popData.product ="last 24 hours "+noOfEvents;
                            popData.name = " No of add to  cart in  " ;
                            popData.timeAgo = " ";
                            popData.location = " ";
                            // popData.image = productImage[0];
                          popData.image="https://f7918d3f2086.ngrok.ioresources/images/shopping-cart.png";
                        //   console.log(popData.image);


                            showPopup(popData, popSettings);

                        });

                    } else {
                        var event3 = 0;
                        document.cookie = "event=" + event3;
                          console.log("purchase"+ event1);
                        var settings2 = {
                            "url": "https://a02fb2bb2238.ngrok.io/api/noOfCheckout",
                            "method": "POST",
                            "timeout": 0,
                        };

                        $.ajax(settings2).done(function(response1) {


                            var noOfEvents = response1.count;
                            popData.product ="last 24 hours "+ noOfEvents;
                            popData.name = " No of purchase in  ";
                            popData.timeAgo = " ";
                            popData.location = " ";
                            // popData.image = productImage[0];
                              popData.image="https://f7918d3f2086.ngrok.ioresources/images/rent.png";
                        // console.log(popData.image);

                            showPopup(popData, popSettings);

                        });

                    }

                    

                } else {
                    document.cookie = "id1=" + id;
                    // console.log(custName);
                    // console.log(value1 + " new order get place");
                    popData.product = "purchased  " + product;
                    popData.name = custName ;
                    // popData.location = custAddress;
                    popData.timeAgo = getDateInMinute;
                    popData.image = productImage[0];
                    //  curIndex = 0;
                //   console.log(popData.image);
                    showPopup(popData, popSettings);
                }
            }

        });
        // debugger;
        if (didShowSalesPop)
            return;
    }
    setInterval(() => checkIfNewProduct(), popInterVal);
    // var seconds = 0 ;
    // setInterval(() =>  { seconds++; console.log(seconds) },1000);
});






    function showPopup1(popData = {}, popSettings = {}) {
        var {
            name,
            product,
            image,
            location,
            timeAgo
        } = popData;
       
        var {
            slideFrom,
            randomImages,
            hideAfter,
            subtitle,
            blinkSubtitle,
            
        } = popSettings;
        console.log(name);
        var varCounter = 0;
        function myFunction() {
   
   $(document).ready(function(){
     
        jQuery("body").append(`	
      	<style>
	
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

	.vin-salespop1{
	  position : fixed ;
	  top : 100px;
	   margin-left: 10px;
	  
	  border: 1px solid #eee ;
	   padding-top: 0.3rem;
	   
	  border-radius : 10px ;
	  box-shadow: 5px 4px 10px #b7b7b7;
font-family: 'Inter', sans-serif;
	  transition: all 500ms ;
	  background: #fff ;
	  z-index: 1000 ;
	 width: 250px ;

	  transition: all 800ms ;
	}
	
	.vin-salespop.active{
	  bottom: 20px ;
	}
	.hide1{
	    left:-500px;
	}
	.hieghtClass{
	   max-height:100px;
	}
	
	
	.vin-salespop.slide-left{
	  left: -9999px ;
	  bottom: 20px ;
	}
	.vin-salespop.slide-left.active{
	  left: 0px ;
	}
	

	.vin-salespop .vsp-img{
	  width : 100% ;
	  height:80px;
	  border-radius : 5px ;
	}
	.vin-salespop .vsp-data{
	  float:right
	  align-items : left ;
	  min-height : 65px ;
	  padding-right: 10px ;
	}
	.vin-salespop.no-img .vsp-data{
	  min-height: 50px  ;
	}
	.vin-salespop.no-img .vsp-img{
	  display: none;
	}
	

	
	.vin-salespop .vsp-subtitle.blink{
	  color : #999 ;
	  animation:blinkingText 1.2s infinite;
	}

	
	
	.vin-salespop i{
	  font-style: normal !important ;
	}
	
	@keyframes blinkingText{
		0%{     color: #bbb;    }
		49%{    color: #bbb; }
		60%{    color: #333; }
		99%{    color: #333;  }
		100%{   color: #bbb;    }
	}
	
	
	
	#leftbox { 
                float:left;  
                padding-top:5px;
                padding-left:10px;
                width:25%; 
                height:100%; 
            } 
            
            #rightbox{ 
                float:right; 
                   padding-top:5px;
               width:70%; 
                height:100%; 
            } 
        .vsp-line{
    	     color: #333;
    	     font-size:15px;
    	font-weight : 700;
             width:100%;
             height:30px;
              padding-top:5px;
    
            }
            .name-input1{
              float:left;
              max-width:70%;
            }
            	.vsp-location{
            	    float:left;
                    max-width:25%;
                }
            	.vin-salespop .vsp-title{
                     display : block ;
                     color: #333;
                    align-items : left ;
                     width:100%;
                     height:30px;
                   
                }
                .product-input{
                     font-size:12px;
    	     font-weight : 450;
                }
            	.note-time{
	            width:100%;
                height:30px;	        
	        	}
	        		.vin-salespop .vsp-time{
            	  font-style : italic ;
            
                 font-size:12px;
                float:left;
               max-width:40%;
	}
                  .vin-salespop .vsp-subtitle{
        	 
        	  font-family: 'Poppins', sans-serif;
        	  font-weight :600;
              font-size:12px;
              float:right;
              width:70%; 
              
              color: #0050C8;
            }   
            #closepop{
                float:right;
            }
    
	</style>
    	<div class='vin-salespop1  hieghtClass' id="target">
		
                <div id = "leftbox"> 
                   <img class='vsp-img' src='https://source.unsplash.com/random' >
                </div>  
                <div id = "rightbox"> 
                     <div class='vsp-line '>
                         <i class='name-input1' >7 Shakra Bracelet</i> <i class="fa fa-close" id="closepop">close</i>
                     </div>
                       <span class='vsp-title'> 
                        <i class=' product-input'> </i>
                          
                             <button id="add_to_cart">Add to cart</button>
 
                      </span>
                      <div class='note-time'>
                 
                        
                        <span class='vsp-subtitle'>

<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 468.293 468.293" style="enable-background:new 0 0 468.293 468.293;" xml:space="preserve" width="12px" height="12px">
<circle style="fill:#0050C8;" cx="234.146" cy="234.146" r="234.146"/>
<polygon style="fill:#EBF0F3;" points="357.52,110.145 191.995,275.67 110.773,194.451 69.534,235.684 191.995,358.148 
	398.759,151.378 "/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
 verified by  Compello</span>
                     </div>
                </div> 
    	</div>`);
  
        });
     }
     
        
        
        
        $(".name-input1").text(name);
        
      var add= setTimeout(myFunction, 1000);
      
      
      
     setTimeout(() => {
            $(".vin-salespop1").addClass("hide1");
        }, 3000);
           
           
     
    	
    
    	

    }
    
   






// function myFunction() {
$('#AddToCart').click(function() {
    var pathUrl = window.location.pathname;
    var data = {
        "type": "addToCart",
        "siteId": siteId,
        "values": pathUrl
    };
    
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(data);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("https://a02fb2bb2238.ngrok.io/api/events", requestOptions)
        .then(response => response.json())
        //   .then(result => console.log(result))
        .catch(error => console.log('error', error));
        
        
        
        
    
       var popData = {
            name: 'Vinit Patil',
            product: '6 Inch Mattress',
            location: '',
            timeAgo: '4',
            image: '',
        };
        var popSettings = {
            slideFrom: 'left',
            randomImages: true,
            hideAfter: 10000,
            // subtitle: '',
            blinkSubtitle: false,
            
        };

        showPopup1(popData, popSettings);
});
var pathUrl = window.location.pathname;
var data = {
    "type": "pageView",
    "siteId": siteId,
    "values": pathUrl
};
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
var raw = JSON.stringify(data);
var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
};
fetch("https://a02fb2bb2238.ngrok.io/api/events", requestOptions)
    .then(response => response.json())
    //   .then(result => console.log(result))
    .catch(error => console.log('error', error));





$('#target').click(function() {
    var pathUrl = window.location.pathname;
    var data = {
        "type": "click",
        "siteId": siteId,
        "values": pathUrl
    };
         
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(data);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("https://a02fb2bb2238.ngrok.io/api/events", requestOptions)
        .then(response => response.json())
        //   .then(result => console.log(result))
        .catch(error => console.log('error', error));
});









$('body').on('click', '#add_to_cart', function() {
    console.log("add to cart");
  jQuery.post('/cart/add.js', {
  items: [
    {
      quantity: 1,
      id: 31757954121771,      
      properties: {
        'First name': 'Caroline'
      }
    }
  ]
});
 location.reload();
});

$('body').on('click', '#closepop', function() {
     $(".vin-salespop1").hide();
});



// $(document).on('click','.add_to_cart',function(){
//     var id="{{ 31757954121771 }}";
//     $.ajax({
//       type: 'POST', 
//       url: '/cart/add.js',
//       dataType: 'json', 
//       data: {id:id,quantity:1},
//       success: function(){
//             location.href="/cart";
//       }
//   });
// })
