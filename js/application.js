$(function(){

//defining application
	var itemkeeper = {};

	(function(app){

	//variable definitions go here
		var $title = $('#title'),
			$item = $('#item'),
			$ul = $('#itemsList'),
			li = '<li><a href="#pgitemsDetail?title=LINK">ID</a></li>',
			itemsHdr = '<li data-role="list-divider">Your items</li>',
			noitems = '<li id="noitems">You have no items</li>';

	//innitiate bindinds and check storage
		app.init = function(){
			app.bindings();
			app.checkForStorage();
		};

	//binding of form
		app.bindings = function(){
			$('#btnAdditem').on('touchend', function(e){
				e.preventDefault();
				//saving item
				app.additem(
					$('#title').val(),
					$('#item').val()
				);
			});
			$(document).on('touchend', '#itemsList a', function(e){
				e.preventDefault();
				var href = $(this)[0].href.match(/\?.*$/)[0];
				var title = href.replace(/^\?title=/,'');
				app.loaditem(title);
			});
			$(document).on('touchend', '#btnDelete', function(e){
				e.preventDefault();
				var key = $(this).data('href');
				app.deleteitem(key);
			});
		};

	//load items (inspect)
		app.loaditem = function(title){
			//get items
			var items = app.getitems(),
				//selecting specific item
				item = items[title],
				page = ['<div data-role="page">',
							'<div data-role="header" data-add-back-btn="true">',
								'<h1>itemkeeper</h1>',
								'<a id="btnDelete" href="" data-href="ID" data-role="button" class="ui-btn-right">Delete</a>',
							'</div>',
							'<div role="main" class="ui-content"><h3>TITLE</h3><p>item</p></div>',
						'</div>'].join('');
			var newPage = $(page);
			//append it to page
			newPage.html(function(index,old){
				return old
						.replace(/ID/g,title)
						.replace(/TITLE/g,title
						.replace(/-/g,' '))
						.replace(/item/g,item);
			}).appendTo($.mobile.pageContainer);
			$.mobile.changePage(newPage);
		};

	//adding item
		app.additem = function(title, item){
			var items = localStorage['itemkeeper'],
				itemsObj;
			if (items === undefined || items === '') {
				itemsObj = {};
			} else {
				itemsObj = JSON.parse(items);
			}
			itemsObj[title.replace(/ /g,'-')] = item;
			localStorage['itemkeeper'] = JSON.stringify(itemsObj);
			//cleaning the entry fields
			$item.val('');
			$title.val('');
			//update the list
			app.displayitems();
		};

	//get items
		app.getitems = function(){
			//get items
			var items = localStorage['itemkeeper'];
			// convert items from string to object
			if(items) return JSON.parse(items);
			return [];
		};

	//item checker
		app.checkForStorage = function(){
			var items = app.getitems();
			// are there existing items?
			if (!$.isEmptyObject(items)) {
				//succesful check for items
				app.displayitems();
			} else {
				//no itens
				$ul.html(itemsHdr + noitems).listview('refresh');
			}
		};

	//display items
		app.displayitems = function(){
			//get items
			var itemsObj = app.getitems(),
				//string creates for html
				html = '',
				n; //make sure your iterators are properly scoped
			//loop over items
			for (n in itemsObj) {
				html += li.replace(/ID/g,n.replace(/-/g,' ')).replace(/LINK/g,n);
			}
			$ul.html(itemsHdr + html).listview('refresh');
		};

	//delete item
		app.deleteitem = function(key){
			//get the items from localStorage
			var itemsObj = app.getitems();
			//delete selected item
			delete itemsObj[key];
			//write back to localStorage
			localStorage['itemkeeper'] = JSON.stringify(itemsObj);
			//return to the list
			$.mobile.changePage('add.html');
			//restart the storage check
			app.checkForStorage();
		};
		//run innit
		app.init();
	})(itemkeeper);
});