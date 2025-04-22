$(document).ready(function () {
var detail_page_jpn = 'https://taacaa.jp/app/preinspection/carDetail.view';
var detail_page_en = 'https://taacaa.jp/app/en/preinspection/carDetail.view';

// local url 
// var show_bid = 'http://127.0.0.1:8000/api/extension-api-others';

// live url  
var show_bid = 'https://purchase.datawise.pk/api/extension-api-others';


let currentUrl = window.location.href;
   
   
    var table =
      `<div style="right:15px;top:10px; width:130px;position:fixed;font-family: Gotham, Helvetica Neue, Helvetica, Arial, sans-serif !important;border-radius: 10px;padding:15px;background-color:#FCBF01;z-index:10000" id="modal_selection_div_id">
      <button id="load_bid_uss" style="padding:3px 12px;width:100%">Show Bid</button>
      </div>`;
     

      setTimeout(() => {
        $("#modal_selection_div_id").draggable();
        }, 1000);

        setTimeout(() => {
          let button = $('#load_bid_uss');
          button.click();
      }, 2000);

    var page_layout = '';
        $("table.favmove tbody tr").each(function () {
          if ($(this).attr("align") === "center") {
            page_layout = "without_pic";
          } else {
            page_layout = "withpic";
              return false; // This breaks out of the .each() loop
          }
      });

  if (currentUrl.startsWith('https://taacaa.jp/app/en/successfulBid/BidList') ||  currentUrl.startsWith('https://taacaa.jp/app/successfulBid/BidList')) {
      $(table).insertAfter('#subnavi_shadow');
  }

  if(currentUrl == detail_page_en || currentUrl == detail_page_jpn){
    setTimeout(function() {
      $(table).insertAfter('#top');
      // let users_bid_div = "<div class='append_bids bid-header' id='" + chassis_detail + "' style='width: 240px; float:left; margin: 0 auto; padding: 5px 0px 11px;'></div>"
      // $(users_bid_div).insertAfter($('table.favmove').eq(1));     
  }, 2000);
  }


  $('body').on('click',"a[href*='popDetail']" ,function (event) {

      var clickedLink = $(this); // Store reference to the clicked link
      console.log(clickedLink)
      if (clickedLink.find("img").length === 0) { // If no <img> inside <a>
        var text = clickedLink.text().trim(); // Get the text inside <a>
      
        if ($.isNumeric(text) && Number.isInteger(parseFloat(text))) { // Check if text is an integer
            if(page_layout == 'withpic'){
              let closet_td = clickedLink.closest("td");
              let chassis_td = closet_td.next().next().next();
              let chassis_no = chassis_td.html().replace(/<br\s*\/?>/g, '-');
            localStorage.setItem("click_chassis", chassis_no);
            }else{
              let closet_tr = clickedLink.closest("tr");
              let chassis_td = closet_tr.find("td").eq(5);
              let chassis_no = chassis_td.html().replace(/<br\s*\/?>/g, '-');
            localStorage.setItem("click_chassis", chassis_no);
            }
        } else {
          
            if(page_layout == 'withpic'){
              let closet_tr = clickedLink.closest("tr");
              let chassis_tr = closet_tr.next();
              let chassis_td = chassis_tr.find("td").eq(4);
              let chassis_no = chassis_td.html().replace(/<br\s*\/?>/g, '-');
              localStorage.setItem("click_chassis", chassis_no);
            }else{
              let closet_tr = clickedLink.closest("tr");
              let chassis_td = closet_tr.find("td").eq(5);
              let chassis_no = chassis_td.html().replace(/<br\s*\/?>/g, '-');
            localStorage.setItem("click_chassis", chassis_no);
            }
        }
      }

      if (clickedLink.find("img").length > 0) { // Check if <img> exists inside <a>
          var firstTr = clickedLink.closest("tr"); // Find closest <tr>
          let target_tr = firstTr.next().next(); // Select the third tr after current tr
            let td = target_tr.find("td").eq(4); // Get 5th td (0-based index)
          
            let chassis_no = td.html().replace(/<br\s*\/?>/g, '-');
            localStorage.setItem("click_chassis", chassis_no); // Save value in localStorage
          // Now trigger the original click event on the <a> after storing the value
          setTimeout(() => {
              clickedLink.off("click").click(); // Remove event handler & trigger click
          }, 500); // Short delay before clicking again
      }
  });

  $('body').on('click', '#load_bid_uss', function () {
    $(".append_bids").remove();
  
    let cars_data_list = [];
    if (page_layout == 'withpic' && (currentUrl.startsWith('https://taacaa.jp/app/en/successfulBid/BidList') || currentUrl.startsWith('https://taacaa.jp/app/successfulBid/BidList'))) {
      $("table.favmove tbody tr[align='center']").each(function(index) {
        if (index >= 2) { // Skip the first two
          let targetRow = $(this).next().next(); // Select the 3rd <tr> after current one
          let tds = targetRow.find("td");
    
          // --- 1. Get Date ---
          let date = formatDate($('#week').val());
    
          // --- 2. Get Lot No ---
          let lot_no = tds.eq(1).find('a').text().trim();
    
          // --- 3. Get Chassis Code ---
          let td = tds.eq(4);
          let chassis_no = '';
          let chassis_modal = '';
          if (td.find('font').length > 0) {
            let fonts = td.find('font');
            if (fonts.length >= 2) {
              let firstFont = $(fonts[0]).text().trim();
              chassis_modal =  firstFont; 
              let secondFont = $(fonts[1]).text().trim();
              chassis_no = firstFont + '-' + secondFont;
            }
          } else {
            let parts = td.html().split(/<br\s*\/?>/i);
            if (parts.length >= 2) {
                let firstPart = parts[0].trim();
                chassis_modal =  firstPart;
                let secondPart = parts[1].trim();
                chassis_no = firstPart + '-' + secondPart;
            } else {
                // If just in case there's only one part
                chassis_no = td.text().trim();
                chassis_modal =  chassis_no;
            }
          }
    
          chassis_no = cleanString(chassis_no);
          chassis_modal = cleanString( chassis_modal);
          // here we append our div
          let unique_append_div_id  = makeUniqueId(lot_no,date,chassis_modal);
          let users_bid_div = "<div class='append_bids bid-header' id='"+unique_append_div_id+"' style=' width: 205px;margin: 0 auto;padding: 5px 0px 11px;'></div>"
          // $(targetRow).next().insertAfter(users_bid_div);
          $(targetRow.find("td").eq(10)).append(users_bid_div)
          // Push to your list
          cars_data_list.push({
            date: date,
            lot_no: lot_no,
            chassis: chassis_no,
            chassis_modal: chassis_modal
          });
        }
      });
    }


    if (page_layout == 'without_pic' && (currentUrl.startsWith('https://taacaa.jp/app/en/successfulBid/BidList') || currentUrl.startsWith('https://taacaa.jp/app/successfulBid/BidList'))) {
      $("table.favmove tbody tr[align='center']").each(function(index) {
        if (index >= 1) {
          let $tds = $(this);
         
          // let targetRow = $(this);
          // --- 1. Date ---
          let date = formatDate($('#week').val());
    
          // --- 2. Lot No ---
          let lot_no = $tds.find('td').eq(1).text().trim();
    
          // --- 3. Chassis No ---
          let chassisTd = $tds.find('td').eq(5);
        
          let chassis_no = '';
          let chassis_modal = '';
          if (chassisTd.find('font').length >= 2) {
            let fonts = chassisTd.find('font');
            let first = $(fonts[0]).text().trim();
            chassis_modal =  first;
            let second = $(fonts[1]).text().trim();
            chassis_no = first + '-' + second;
          } else {
            // fallback: split by <br>
            let parts = chassisTd.html().split(/<br\s*\/?>/i);
            if (parts.length >= 2) {
                let firstPart = parts[0].trim();
                chassis_modal =  firstPart;
                let secondPart = parts[1].trim();
                chassis_no = firstPart + '-' + secondPart;
            } else {
                // If just in case there's only one part
                chassis_no = chassisTd.text().trim();
                chassis_modal =  chassis_no;
            }
          }
    
          chassis_no = cleanString(chassis_no);
          
          chassis_modal = cleanString( chassis_modal);
            // here we append our div
            let unique_append_div_id  = makeUniqueId(lot_no,date,chassis_modal);
            let users_bid_div = "<div class='append_bids bid-header' id='"+unique_append_div_id+"' style=' width: 205px;margin: 0 auto;padding: 5px 0px 11px;'></div>"
            // $(targetRow).next().insertAfter(users_bid_div);
            $(users_bid_div).insertAfter($('table.favmove').eq(1));
          
          // --- Add to array ---
          cars_data_list.push({
            date: date,
            lot_no: lot_no,
            chassis: chassis_no,
            chassis_modal: chassis_modal
          });
        }
      });
    }
    

    if(currentUrl == detail_page_en ||  currentUrl == detail_page_jpn){
      
      let lot_no = $('.blue09').text()
      let target_tr = $('.blue09').closest('tr');
      let target_tr_id = target_tr.attr('id');

      let date = formatDate(target_tr_id.substring(7, 15));
      

      let chassisTd = target_tr.find('td').eq(3);
          let chassis_modal = '';
          if (chassisTd.find('font').length >= 2) {
            let fonts = chassisTd.find('font');
            let first = $(fonts[0]).text().trim();
            chassis_modal =  first;
           
          } else {
            // fallback: split by <br>
            let parts = chassisTd.html().split(/<br\s*\/?>/i);
            if (parts.length >= 2) {
                let firstPart = parts[0].trim();
                chassis_modal =  firstPart;
               
            } else {
                // If just in case there's only one part
                chassis_modal =  chassisTd.text().trim();
            }
          }
        
        let unique_append_div_id  = makeUniqueId(lot_no,date,chassis_modal);
        let users_bid_div = "<div class='append_bids bid-header' id='"+unique_append_div_id+"' style=' width: 205px;margin: 0 auto;padding: 5px 0px 11px;float: inline-start;'></div>"
        // $(targetRow).next().insertAfter(users_bid_div);
        // $($tds.find("td").eq(11)).append(users_bid_div)
        $(users_bid_div).insertAfter($('table.favmove').eq(1)); 

        cars_data_list.push({
          date: date,
          lot_no: lot_no,
          chassis_modal: chassis_modal
        });
      // $('.append_bids').each(function() {  
      //   if ($(this).attr('id')) {
      //     let id =  $(this).attr('id');
      //     cars_data_list.push({ chassis: id});
      //   }
      // });
    }
 
						
    $.ajax({
        type: 'POST',
        url: show_bid,
        crossDomain: true,
        async: true,
        data: {  action: "tcc_wp_bid", data: JSON.stringify(cars_data_list)},
        success: function (data) {
          $(".append_bids").each(function () {
            $(this).empty(); // Remove all content inside
          });
        if(data.data.length == 0){
          alert('No record found!')
          return ;
        }
         
         if(currentUrl.startsWith('https://taacaa.jp/app/en/successfulBid/BidList') || currentUrl.startsWith('https://taacaa.jp/app/successfulBid/BidList')){
          data.data.forEach(function(record) {
                    let hr_name = record.country.css_class;
                let show_bid_name = record.user.user_id + "(" + record.country.hr_name + ")";
                let  f_bid_price = record.rate;
                let  user_id = record.user.user_id;
                let sh_cntry = record.country.hr_name;
                let unique_id_data = makeUniqueId(record.lot_no,formatDate($('#week').val()),record.chassis_code)

                let redText = $('#'+unique_id_data).closest("td").find(".red").text();

                let match = redText.match(/[\d,]+/); // Match numbers including commas
                var successBid = 0;
                if (match) {
                    successBid = parseInt(match[0].replace(/,/g, ""), 10); // Remove commas and convert to integer
                }
                
                let rate_color  =   (typeof record.rate === "number") ? getBidColor(successBid,record.rate) : 'black';

                let user_bid = getUserData(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,record.expense,record.remark ?? '',rate_color)
                  

                $('#'+unique_id_data).append(user_bid)
          });

          }

          if(currentUrl == detail_page_en ||  currentUrl == detail_page_jpn){
            data.data.forEach(function(record) {
            let hr_name = record.country.css_class;
            let show_bid_name = record.user.user_id + "(" + record.country.hr_name + ")";
            let  f_bid_price = record.rate;
            let  user_id = record.user.user_id;
            let sh_cntry = record.country.hr_name;
          

            let redText = $('.blue09').closest('tr').find(".red").text();

            let match = redText.match(/[\d,]+/); // Match numbers including commas
            var successBid = 0;
            if (match) {
                successBid = parseInt(match[0].replace(/,/g, ""), 10); // Remove commas and convert to integer
            }
            
            let rate_color  =   (typeof record.rate === "number") ? getBidColor(successBid,record.rate) : 'black';

            let user_bid = getUserData(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,record.expense,record.remark ?? '',rate_color)
              

            $('.append_bids').append(user_bid)
            });
          }

        },
        error: function(xhr, status, error) {
          var errorMessage = xhr.status + ': ' + xhr.statusText;
          alert('Error - ' + errorMessage);
        }
      });

  
  });


  // when click on the next and and previous btn of page 
  $('body').on('click', 'a[href*="changeDetail"],a[href*="JavaScript:changePage"]', function () {
    $(".append_bids").remove();
    setTimeout(() => {
      
      let cars_data_list = [];
      if (page_layout == 'withpic' && (currentUrl.startsWith('https://taacaa.jp/app/en/successfulBid/BidList') || currentUrl.startsWith('https://taacaa.jp/app/successfulBid/BidList'))) {
        $("table.favmove tbody tr[align='center']").each(function(index) {
          if (index >= 2) { // Skip the first two
            let targetRow = $(this).next().next(); // Select the 3rd <tr> after current one
            let tds = targetRow.find("td");
      
            // --- 1. Get Date ---
            let date = formatDate($('#week').val());
      
            // --- 2. Get Lot No ---
            let lot_no = tds.eq(1).find('a').text().trim();
      
            // --- 3. Get Chassis Code ---
            let td = tds.eq(4);
            let chassis_no = '';
            let chassis_modal = '';
            if (td.find('font').length > 0) {
              let fonts = td.find('font');
              if (fonts.length >= 2) {
                let firstFont = $(fonts[0]).text().trim();
                chassis_modal =  firstFont; 
                let secondFont = $(fonts[1]).text().trim();
                chassis_no = firstFont + '-' + secondFont;
              }
            } else {
              let parts = td.html().split(/<br\s*\/?>/i);
              if (parts.length >= 2) {
                  let firstPart = parts[0].trim();
                  chassis_modal =  firstPart;
                  let secondPart = parts[1].trim();
                  chassis_no = firstPart + '-' + secondPart;
              } else {
                  // If just in case there's only one part
                  chassis_no = td.text().trim();
                  chassis_modal =  chassis_no;
              }
            }
      
            chassis_no = cleanString(chassis_no);
            chassis_modal = cleanString( chassis_modal);
            // here we append our div
            let unique_append_div_id  = makeUniqueId(lot_no,date,chassis_modal);
            let users_bid_div = "<div class='append_bids bid-header' id='"+unique_append_div_id+"' style=' width: 205px;margin: 0 auto;padding: 5px 0px 11px;'></div>"
            // $(targetRow).next().insertAfter(users_bid_div);
            $(targetRow.find("td").eq(10)).append(users_bid_div)
            // Push to your list
            cars_data_list.push({
              date: date,
              lot_no: lot_no,
              chassis: chassis_no,
              chassis_modal: chassis_modal
            });
          }
        });
      }
  
  
      if (page_layout == 'without_pic' && (currentUrl.startsWith('https://taacaa.jp/app/en/successfulBid/BidList') || currentUrl.startsWith('https://taacaa.jp/app/successfulBid/BidList'))) {
        $("table.favmove tbody tr[align='center']").each(function(index) {
          if (index >= 1) {
            let $tds = $(this);
           
            // let targetRow = $(this);
            // --- 1. Date ---
            let date = formatDate($('#week').val());
      
            // --- 2. Lot No ---
            let lot_no = $tds.find('td').eq(1).text().trim();
      
            // --- 3. Chassis No ---
            let chassisTd = $tds.find('td').eq(5);
          
            let chassis_no = '';
            let chassis_modal = '';
            if (chassisTd.find('font').length >= 2) {
              let fonts = chassisTd.find('font');
              let first = $(fonts[0]).text().trim();
              chassis_modal =  first;
              let second = $(fonts[1]).text().trim();
              chassis_no = first + '-' + second;
            } else {
              // fallback: split by <br>
              let parts = chassisTd.html().split(/<br\s*\/?>/i);
              if (parts.length >= 2) {
                  let firstPart = parts[0].trim();
                  chassis_modal =  firstPart;
                  let secondPart = parts[1].trim();
                  chassis_no = firstPart + '-' + secondPart;
              } else {
                  // If just in case there's only one part
                  chassis_no = chassisTd.text().trim();
                  chassis_modal =  chassis_no;
              }
            }
      
            chassis_no = cleanString(chassis_no);
            
            chassis_modal = cleanString( chassis_modal);
              // here we append our div
              let unique_append_div_id  = makeUniqueId(lot_no,date,chassis_modal);
              let users_bid_div = "<div class='append_bids bid-header' id='"+unique_append_div_id+"' style=' width: 205px;margin: 0 auto;padding: 5px 0px 11px;'></div>"
              // $(targetRow).next().insertAfter(users_bid_div);
              $($tds.find("td").eq(11)).append(users_bid_div)
            // --- Add to array ---
            cars_data_list.push({
              date: date,
              lot_no: lot_no,
              chassis: chassis_no,
              chassis_modal: chassis_modal
            });
          }
        });
      }
      
  
      if(currentUrl == detail_page_en ||  currentUrl == detail_page_jpn){
      
        let lot_no = $('.blue09').text()
        let target_tr = $('.blue09').closest('tr');
        let target_tr_id = target_tr.attr('id');
  
        let date = formatDate(target_tr_id.substring(7, 15));
        
  
        let chassisTd = target_tr.find('td').eq(3);
            let chassis_modal = '';
            if (chassisTd.find('font').length >= 2) {
              let fonts = chassisTd.find('font');
              let first = $(fonts[0]).text().trim();
              chassis_modal =  first;
             
            } else {
              // fallback: split by <br>
              let parts = chassisTd.html().split(/<br\s*\/?>/i);
              if (parts.length >= 2) {
                  let firstPart = parts[0].trim();
                  chassis_modal =  firstPart;
                 
              } else {
                  // If just in case there's only one part
                  chassis_modal =  chassisTd.text().trim();
              }
            }
          
          let unique_append_div_id  = makeUniqueId(lot_no,date,chassis_modal);
          let users_bid_div = "<div class='append_bids bid-header' id='"+unique_append_div_id+"' style=' width: 205px;margin: 0 auto;padding: 5px 0px 11px;float: inline-start;'></div>"
          // $(targetRow).next().insertAfter(users_bid_div);
          // $($tds.find("td").eq(11)).append(users_bid_div)
          $(users_bid_div).insertAfter($('table.favmove').eq(1)); 
  
          cars_data_list.push({
            date: date,
            lot_no: lot_no,
            chassis_modal: chassis_modal
          });
        // $('.append_bids').each(function() {  
        //   if ($(this).attr('id')) {
        //     let id =  $(this).attr('id');
        //     cars_data_list.push({ chassis: id});
        //   }
        // });
      }
   
              
      $.ajax({
          type: 'POST',
          url: show_bid,
          crossDomain: true,
          async: true,
          data: {  action: "tcc_wp_bid", data: JSON.stringify(cars_data_list)},
          success: function (data) {

            $(".append_bids").each(function () {
              $(this).empty(); // Remove all content inside
          });


          if(data.data.length == 0){
            alert('No record found!')
            return ;
          }
           
           if(currentUrl.startsWith('https://taacaa.jp/app/en/successfulBid/BidList') || currentUrl.startsWith('https://taacaa.jp/app/successfulBid/BidList')){
            data.data.forEach(function(record) {
                      let hr_name = record.country.css_class;
                  let show_bid_name = record.user.user_id + "(" + record.country.hr_name + ")";
                  let  f_bid_price = record.rate;
                  let  user_id = record.user.user_id;
                  let sh_cntry = record.country.hr_name;
                  let unique_id_data = makeUniqueId(record.lot_no,formatDate($('#week').val()),record.chassis_code)
  
                  let redText = $('#'+unique_id_data).closest("td").find(".red").text();
  
                  let match = redText.match(/[\d,]+/); // Match numbers including commas
                  var successBid = 0;
                  if (match) {
                      successBid = parseInt(match[0].replace(/,/g, ""), 10); // Remove commas and convert to integer
                  }
                  
                  let rate_color  =   (typeof record.rate === "number") ? getBidColor(successBid,record.rate) : 'black';
  
                  let user_bid = getUserData(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,record.expense,record.remark ?? '',rate_color)
                    
  
                  $('#'+unique_id_data).append(user_bid)
            });
  
            }
  
            if(currentUrl == detail_page_en ||  currentUrl == detail_page_jpn){
              data.data.forEach(function(record) {
                let hr_name = record.country.css_class;
            let show_bid_name = record.user.user_id + "(" + record.country.hr_name + ")";
            let  f_bid_price = record.rate;
            let  user_id = record.user.user_id;
            let sh_cntry = record.country.hr_name;
           
  
            let redText = $('.blue09').closest('tr').find(".red").text();
  
            let match = redText.match(/[\d,]+/); // Match numbers including commas
            var successBid = 0;
            if (match) {
                successBid = parseInt(match[0].replace(/,/g, ""), 10); // Remove commas and convert to integer
            }
            
            let rate_color  =   (typeof record.rate === "number") ? getBidColor(successBid,record.rate) : 'black';
  
            let user_bid = getUserData(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,record.expense,record.remark ?? '',rate_color)
              
  
            $('.append_bids').append(user_bid)
      });
              // $('.append_bids').each(function() {  
              //   if ($(this).attr('id')) {
              //     let id =  $(this).attr('id');
              //     data.data.map(function(record){
              //       let hr_name = record.country.css_class;
              //       let show_bid_name = record.user.user_id + "(" + record.country.hr_name + ")";
              //       let  f_bid_price = record.rate;
              //       let  user_id = record.user.user_id;
              //       let sh_cntry = record.country.hr_name;
                    
              //       let user_bid = getUserData(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,record.expense,record.remark ?? '',)
                   
              //       $('#'+record.chassis).append(user_bid)
              //     });
              //   }
              // });
            }
  
         
  
            // if(currentUrl == 'https://www.uss-engine.com/tradecardetail.action' && data.data.length > 0){
            
            //  let user_bid =''; 
            //     data.data.map(function(record){
            //       let hr_name = record.country.hr_name;
            //       let show_bid_name = record.user.user_id + "(" + record.country.hr_name + ")";
            //       let  f_bid_price = record.rate;
            //       let  user_id = record.user.user_id;
            //       let sh_cntry = record.country.hr_name;
                  
            //       user_bid = getUserData(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry)
            //     });
            //     $('#append_bids').html(user_bid)
            // }
          },
          error: function(xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText;
            alert('Error - ' + errorMessage);
          }
        });

    }, 2000);

  });


});
function cleanString(input) {
  return input.replace(/[^a-zA-Z0-9-]/g, '');
}

function getBidColor(successfulBid, bidPrice) {
let success_bid = successfulBid / 10;
let threshold = bidPrice + (bidPrice * 0.10); // Add 10% of bid_Price
return threshold < success_bid ? "red" : "black"; // Check condition
}

function getFirstName(name) {
return name.split("_")[0]; // Split by '_' and return the first element
}
function formatDate(rawDate) {
  return rawDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
}

function getUserData(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,expense,remark,rate_color = 'black'){
  return getUserdataLikeIuacExt(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,expense,remark,rate_color)
}

function getUserdataLikeIuacExt(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,expense,remark,rate_color){
  // let user_name = getFirstName(user_id);
  // let expense_deducted = `<span style="color: black; font-size: 14px; margin: 0 2px;color:black;font-size: 12px">Trp: ${expense}</span>`;

  // let add_bid =
  //     `<div style="background-color: #FCBF01; padding: 3px; font-family: Arial; width: 100%; box-sizing: border-box;">
  //         <!-- First Row -->
  //         <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
  //             <span style="display: flex; align-items: center;">
  //                 <span title="${show_bid_name}" class="flag ${hr_name}" style="margin-right: 2px;"></span>
  //                 <div title="${sh_cntry}" style="white-space: nowrap; max-width: 80px; overflow: hidden; text-overflow: ellipsis; font-size: 12px;color:black">${sh_cntry}</div>
  //             </span>
  //             ${expense_deducted}
  //             <sp
          
  //         <!-- Second Row -->
  //         <div style="display: flex; gap: 3px; justify-content: center;">
  //             <input title="${show_bid_name}" 
  //                 style="width: 98px; font-weight: bold; padding: 5px; height: 20px; text-align: center; border-radius: 3px; border: none; background-color: white; color: ${rate_color}; box-sizing: border-box;"
  //                 class="already_bid_value njm_pre_price show_space_tb" disabled type="text" value="${f_bid_price}" placeholder="Bid...." />

  //             <input title="${show_bid_name}" 
  //                 style="width: 98px; font-weight: bold; padding: 5px; height: 20px; text-align: center; border-radius: 3px; border: none; background-color: white; box-sizing: border-box;"
  //                 class="already_bid_value njm_pre_ramarks" type="text" disabled value="${remark}" placeholder="Remarks...." />
  //         </div>

        
  //     </div>`;

  // return add_bid;
  let user_name = getFirstName(user_id);
  let expense_deducted = `<span style="color: black; font-size: 14px; margin: 0 2px;color:black;font-size: 12px">Trp: ${expense}</span>`;

  let add_bid =
      `<div style="background-color: #FCBF01; padding: 3px; font-family: Arial; width: 100%; box-sizing: border-box;">
          <!-- First Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
              <span style="display: flex; align-items: center;">
                  <span title="${show_bid_name}" class="flag ${hr_name}" style="margin-right: 2px;"></span>
                  <div title="${sh_cntry}" style="white-space: nowrap; max-width: 80px; overflow: hidden; text-overflow: ellipsis; font-size: 12px;color:black">${sh_cntry}</div>
              </span>
              ${expense_deducted}
              <span style="font-size: 13px; margin: 0 2px;color:black" title="${user_id}">👤 ${user_name}</span>
          </div>
          
          <!-- Second Row -->
          <div style="display: flex; gap: 3px; justify-content: center;">
              <input title="${show_bid_name}" 
                  style="width: 98px; font-weight: bold; padding: 5px; height: 20px; text-align: center; border-radius: 3px; border: none; background-color: white; color: ${rate_color}; box-sizing: border-box;"
                  class="already_bid_value njm_pre_price show_space_tb" disabled type="text" value="${f_bid_price}" placeholder="Bid...." />

              <input title="${show_bid_name}" 
                  style="width: 98px; font-weight: bold; padding: 5px; height: 20px; text-align: center; border-radius: 3px; border: none; background-color: white; box-sizing: border-box;"
                  class="already_bid_value njm_pre_ramarks" type="text" disabled value="${remark}" placeholder="Remarks...." />
          </div>

         
      </div>`;

  return add_bid;
}


function removeLeadingZeros(value) {
  return Number(value);
}
function makeUniqueId(lot_no, date, chassis_modal) {
  // Clean each part
  lot_no = String(lot_no).trim().replace(/^0+/, ''); // remove leading zeros
  date = String(date).trim().replace(/-/g, '');       // remove hyphens if any
      // your own string cleaner

  return `${lot_no}_${date}_${chassis_modal}`;        // join with underscores
}

