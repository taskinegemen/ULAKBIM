<script type="text/javascript">
	$( document ).ready(function() {
		$(".items").addClass("datatable table table-striped table-bordered table-hover dataTable").removeClass("items");
		$(".mybooks_page_container").css("overflow","auto");

		var id=0;




		$('#yw2 a.update').click(function(){
			$("#update").modal("show");
			id=$($($(this).parent().parent()[0]).children()[0]).html();
			$('#name').val($($($(this).parent().parent()[0]).children()[1]).html());
			$('#surname').val($($($(this).parent().parent()[0]).children()[2]).html());
			$('#email').val($($($(this).parent().parent()[0]).children()[3]).html());

		});
		
		$('#updateUser').click(function(){

			var name=$('#name').val();
			var surname=$('#surname').val();
			var email=$('#email').val();

			$.ajax({
			  type: "POST",
			  data: {id: id,name:name,surname:surname,email:email},
			  url: '/management/updateUser',
			}).done(function(res){
				$("#update").modal("hide");
				console.log($(location).attr('href'));
				//location.href = $(location).attr('href');
				location.reload();
			});

		});
		





		$('#yw2 a.delete').click(function(){
			$("#delete").modal("show");
			id=$($($(this).parent().parent()[0]).children()[0]).html();
			var name=$($($(this).parent().parent()[0]).children()[1]).html();
			var surname=$($($(this).parent().parent()[0]).children()[2]).html();
			$('#userInfo').text(name+' '+surname);

			console.log(id);

		});


		$('#deleteUser').click(function(){
			$.ajax({
			  type: "POST",
			  data: {id: id},
			  url: '/management/delete',
			}).done(function(res){
				$("#delete").modal("hide");
				location.reload();

			});
		});






		$('#yw2 a.resetPassword').click(function(){
			$("#resetpassword").modal("show");
			$('#resetUserPassword').show();
			$('#resetpasswordBody').html('<b id="userInfo2"></b> '+j__("adlı kullanıcıya şifre yenileme epostası gönderilecek. Onaylıyor musunuz?"));
			id=$($($(this).parent().parent()[0]).children()[0]).html();
			var name=$($($(this).parent().parent()[0]).children()[1]).html();
			var surname=$($($(this).parent().parent()[0]).children()[2]).html();
			$('#userInfo2').text(name+' '+surname);

			console.log(id);

		});


		$('#resetUserPassword').click(function(){
			$('#resetUserPassword').hide();
			$.ajax({
			  type: "POST",
			  data: {id: id},
			  url: '/management/resetPassword',
			}).done(function(res){
				if (res=="1") {
					$('#resetpasswordBody').html('<div class="alert alert-success">'+j__("Şifre yenileme epostası başarıyla gönderildi.")+'</div>');
				}else{
					$('#resetpasswordBody').html('<div class="alert alert-danger">'+res+'</div>');
				};
				// $("#resetpassword").modal("hide");
				// location.reload();

			});
		});
		
		
		$('#yw2 a.sendEmail').click(function(){
			$("#sendmailUser").show();
			$("#sendemail").modal("show");
			$('#sendMailModalBody').html('<form role="form"><div class="form-group"><label for="message">'+j__("Mesaj")+'</label><textarea rows="3" cols="5" name="message" id="message" class="countable form-control" data-limit="100"></textarea></div></form>');
			id=$($($(this).parent().parent()[0]).children()[0]).html();
			var name=$($($(this).parent().parent()[0]).children()[1]).html();
			var surname=$($($(this).parent().parent()[0]).children()[2]).html();
		});


		$('#sendmailUser').click(function(){
			var message=$('#message').val();
			$('#sendmailUser').hide();
			$.ajax({
			  type: "POST",
			  data: {id: id,message:message},
			  url: '/management/sendMail',
			}).done(function(res){
				if (res=="1") {
					$('#sendMailModalBody').html('<div class="alert alert-success">'+j__("Mesajınız başarıyla gönderildi.")+'</div>');
				}else{
					$('#sendMailModalBody').html('<div class="alert alert-danger">'+res+'</div>');
				};
				// $("#resetpassword").modal("hide");
				// location.reload();

			});
		});


		$('tr>td:first-child').hide();
		$('#yw2_c0').hide();
	});
</script>


<form role="form">
  <div class="form-group col-md-3">
	<input type="text" name="filter" class="form-control" id="filter" placeholder="Ara" value="" style="width:200px;display:inline">
  	<button class="btn btn-primary" type="submit"><?php _e("Ara"); ?></button>
  </div>
</form>



<!-- Modal -->
<div class="modal fade" id="update" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel"><?php _e("Kullanıcı Güncelle"); ?></h4>
      </div>
      <div class="modal-body">
        <form role="form">
		  <div class="form-group">
			<label for="name"><?php _e("İsim"); ?></label>
			<input type="text" name="name" class="form-control" id="name" placeholder="" value="">
		  </div>
		  <div class="form-group">
			<label for="surname"><?php _e("Soyisim"); ?></label>
			<input type="text" class="form-control" id="surname" placeholder="" value="" name="surname">
		  </div>
		  <div class="form-group">
			<label for="email"><?php _e("Eposta"); ?></label>
			<input type="text" class="form-control" id="email" placeholder="" name="email" value="">
		  </div>
		  
		</form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal"><?php _e("Kapat"); ?></button>
	  	<a id="updateUser" class="btn btn-success"><?php _e("Kaydet"); ?></a>
      </div>
    </div>
  </div>
</div>




<!-- Modal -->
<div class="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel"><?php _e("Kullanıcı Sil"); ?></h4>
      </div>
      <div class="modal-body">
      	<b id="userInfo"></b> <?php _e("adlı kullanıcıyı silmek istediğinizden emin misiniz?"); ?>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal"><?php _e("Kapat"); ?></button>
	  	<a id="deleteUser" class="btn btn-success"><?php _e("Sil"); ?></a>
      </div>
    </div>
  </div>
</div>


<!-- Modal -->
<div class="modal fade" id="resetpassword" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel"><?php _e("Kullanıcı Şifre Yenileme"); ?></h4>
      </div>
      <div class="modal-body" id="resetpasswordBody">
      	<b id="userInfo2"></b> <?php _e("adlı kullanıcıya şifre yenileme epostası gönderilecek. Onaylıyor musunuz?"); ?>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal"><?php _e("Kapat"); ?></button>
	  	<a id="resetUserPassword" class="btn btn-success"><?php _e("Gönder"); ?></a>
      </div>
    </div>
  </div>
</div>






<!-- Modal -->
<div class="modal fade" id="sendemail" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel"><?php _e("Kullanıcıya eposta gönder"); ?></h4>
      </div>
      <div class="modal-body" id="sendMailModalBody">
        <form role="form">
		  <div class="form-group">
			<label for="message"><?php _e("Mesaj"); ?></label>
			<textarea rows="3" cols="5" name="message" id="message" class="countable form-control" data-limit="100"></textarea>
		  </div>
		</form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal"><?php _e("Kapat"); ?></button>
	  	<a id="sendmailUser" class="btn btn-success"><?php _e("Gönder"); ?></a>
      </div>
    </div>
  </div>
</div>

