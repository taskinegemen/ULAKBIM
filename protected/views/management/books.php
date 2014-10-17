<script type="text/javascript" src="<?php echo Yii::app()->getBaseUrl(true); ?>/js/lib/bootstrap-select.js"></script>
<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->getBaseUrl(true); ?>/css/bootstrap-select.css">
<script type="text/javascript">
	$( document ).ready(function() {

		$(".items").addClass("datatable table table-striped table-bordered table-hover dataTable").removeClass("items");


		var bookId="";
		$("#remove_book").click(function(){
			var from="management";
			var link ="/organisations/removeFromCategory?id="+bookId+"&from="+from;
		    window.location.assign(link);
		    //console.log(link);
			$("#remove_bookModal").modal("hide");
		});

		$('.removefrompublished').click(function(){
			$("#remove_bookModal").modal("show");
			bookId=$($($(this).parent().parent()[0]).children()[0]).html();
		});


		$('.updateBook').click(function(){
			$("#updateBookTitle").modal("show");
			bookId=$($($(this).parent().parent()[0]).children()[0]).html();
			$("#updateContentAuthor").val($($($(this).parent().parent()[0]).children()[1]).html());
			$("#updateContentTitle").val($($($(this).parent().parent()[0]).children()[2]).html());
		});

		$("#update_book_title").click(function(){
			var from="management";
			var title=$("#updateContentTitle").val();
			var author=$("#updateContentAuthor").val();
			var link ="/book/updateBookTitle?bookId="+bookId+'&title='+title+'&author='+author+'&from='+from;
		    window.location.assign(link);
			$("#updateBookTitle").modal("hide");
		});

		$("#delete_book").click(function(){
		  	$.ajax({
			  url: "/book/delete/"+bookId,
			}).done(function() {
			  $('#removeBook').modal('hide');
			  location.reload();
			});
		 });

		$('.removeBook').click(function () {
			bookId=$($($(this).parent().parent()[0]).children()[0]).html();
		    $('#book_id').val(bookId);
			  $('#removeBook').modal('show');
		  });

		$('.usersBook').click(function () {
			bookId=$($($(this).parent().parent()[0]).children()[0]).html();

			

			$.ajax({
			  url: "/management/getBookUsers/"+bookId,
			}).done(function(res) {
				var result = JSON.parse(res);
				//console.log(result);
				$("#bookUsers").html("");
				$.each(result, function( index, value ) {
					var userType="Kullanıcı";
					if (value.type=="owner") {
						userType="Sahibi";
					}else if(value.type=="editor"){
						userType="Editör";
					};
					$('<div class="well well-sm">\
						<div id="editor-name" class="col-md-10">'+value.name+' '+value.surname+'</div>\
					    <div id="editor-tag" class="col-md-1">'+userType+'</div>\
					    <div class="col-md-1"><a class="fa fa-trash-o pull-right" href="/management/deleteBookUser?userId='+value.user_id+'&bookId='+value.book_id+'" id="yt2"></a></div>\
					   <div class="clearfix"></div></div>').appendTo("#bookUsers");
					
				});
					
						
			});


			$('#usersBook').modal('show');
		  });

	$.ajax({
	  url: "/management/getAllUsers/",
	}).done(function(res) {
		var result = JSON.parse(res);
		//id_select
		$.each(result, function( index, value ) {
			//console.log(value);

			$('<option value="'+value.id+'">'+value.name+' '+value.surname+'</option>').appendTo('#id_select');
		});
	$('.selectpicker').selectpicker({});
	});


	$('tr>td:first-child').hide();
	$('#yw2_c0').hide();
	$('tr>td:nth-child(2)').hide();
	$('#yw2_c1').hide();

	$('#add_book_user').click(function(){
	    var userId=$('#id_select').val();
	    var newUser=$('#newUser').val();
	    var type=$('#type').val();
	    if (newUser) {
	    	var link ='/site/right?userId='+newUser+'&bookId='+bookId+'&type='+type+'&newUser=1&from=management';
	    }else{
	    	var link ='/site/right?userId='+userId+'&bookId='+bookId+'&type='+type+'&from=management';
	    };
	    window.location.assign(link);
	    //console.log(link);
	});

});


</script>
<form role="form">
  <div class="form-group col-md-3">
	<input type="text" name="filter" class="form-control" id="filter" placeholder="Ara" value="" style="width:200px;display:inline">
  	<button class="btn btn-primary" type="submit">Ara</button>
  </div>
</form>

<!-- Yayından Kaldır -->
<div class="modal fade" id="remove_bookModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
	  <div class="modal-content">
		<div class="modal-header">
		  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		  <h4 class="modal-title"><?php _e("Yayından Kaldır"); ?></h4>
		</div>
		<div class="modal-body">
		 	<?php _e("Eseri yayından kaldırmak istiyor musunuz? Onay verdiğinizde eser yayınlanmış kategorisinden kaldırılıp düzenlenme aşamasına gönderilecek. Ayrıca eserler okuyuculardan da kaldırılacak.");?>
		</div>
	      <div class="modal-footer">
	      	<button type="button" class="btn btn-primary" id="remove_book"><?php _e("Kaldır"); ?></a>
	        <button type="button" class="btn btn-default" data-dismiss="modal"><?php _e("Vazgeç"); ?></button>
	      </div>
		</div>
	  </div>
	</div>
 
<!-- Yayından Kaldır -->


<!-- Kitap ismini değiştir -->
<div class="modal fade" id="updateBookTitle" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
	  <div class="modal-content">
		<div class="modal-header">
		  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		  <h4 class="modal-title"><?php _e("Eseri Güncelle"); ?></h4>
		</div>
		<div class="modal-body">
		 	<form id="copy" method="post" class="form-horizontal">
				<div class="form-group">
					<label class="control-label col-md-3" for="contentTitle"><?php _e("Eser Adı"); ?><span class="required">*</span></label>
					<div class="col-md-6">
						<input class="form-control" name="contentTitle" placeholder="Lütfen bir isim girin!" id="updateContentTitle" type="text">															
					</div>
				</div>	
				<div class="form-group">
					<label class="control-label col-md-3" for="contentAuthor"><?php _e("Yazar Adı"); ?><span class="required">*</span></label>
					<div class="col-md-6">
						<input class="form-control" name="contentAuthor" placeholder="<?php _e('Yazarın Adını Girin!'); ?>" id="updateContentAuthor" type="text">															
					</div>
				</div>
		 	</form>
		</div>
	      <div class="modal-footer">
	      	<button type="button" class="btn btn-primary" id="update_book_title"><?php _e("Güncelle"); ?></a>
	        <button type="button" class="btn btn-default" data-dismiss="modal"><?php _e("Vazgeç"); ?></button>
	      </div>
		</div>
	  </div>
	</div>
 
<!-- Kitap ismini değiştir -->

<!-- Kitap silme -->
<div class="modal fade" id="removeBook" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel"><?php _e("Sil"); ?></h4>
      </div>
      <div class="modal-body">
        <?php _e("Silmek istediğinizden emin misiniz?"); ?>
      </div>
      <input type="hidden" name="book_id" id="book_id" value="">
      <div class="modal-footer">
      	<button type="button" class="btn btn-primary" id="delete_book"><?php _e("Evet"); ?></a>
        <button type="button" class="btn btn-default" data-dismiss="modal"><?php _e("Hayır"); ?></button>      
      </div>
    </div>
  </div>
</div>

<!-- Kitap silme -->



<!-- Kullanıcılar -->
<div class="modal fade" id="usersBook" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel"><?php _e("Kitap Kullanıcıları"); ?></h4>
      </div>
      <div class="modal-body">
			<div id="bookUsers">
				
			</div>
			<div id="addBookUsers">
				<div class="alert alert-info">
					<form class="form-horizontal" role="form" id="a'+bookId+'">
						<h4 class="editor-name"><?php _e("Kullanıcı Ekle"); ?></h4>
						<input id="book" value="'+bookId+'" style="display:none">
						<div class="form-group">
							<label class="col-sm-3 control-label"><?php _e("Kayıtlı kullanıcılar: "); ?></label>
							<div class="col-sm-7">
								<select id="id_select" class="selectpicker" data-live-search="true">
							    </select>
							</div>
						</div>
						<h4 class="" style="text-align: center;"><?php _e("Veya"); ?></h4>
						<div class="form-group">
							<label class="col-sm-3 control-label"><?php _e("Yeni kullanıcı: "); ?></label>
							<div class="col-sm-7">
								<input class="form-control" id="newUser" type="text" placeholder="email">
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label"><?php _e("Kullanıcı Tipi: "); ?></label>
							<div class="col-sm-7">
								 <select id="type" class="form-control">
								  <option value="editor"><?php _e("Editör"); ?></option>
								  <option value="owner"><?php _e("Sahibi"); ?></option>
								</select>
							</div>
						</div>
					</form>
					</div>
			</div>
      </div>
      <div class="modal-footer">
      	<a type="button" class="btn btn-primary" href="#" id="add_book_user"><?php _e("Ekle"); ?></a>
        <button type="button" class="btn btn-default" data-dismiss="modal"><?php _e("Vazgeç"); ?></button>     
      </div>
    </div>
  </div>
</div>
<!-- Kullanıcılar -->
