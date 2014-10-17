<script type="text/javascript">
	$( document ).ready(function() {
		$(".items").addClass("datatable table table-striped table-bordered table-hover dataTable").removeClass("items");
		$(".mybooks_page_container").css("overflow","auto");

		var id=0;




		$('#yw2 a.update').click(function(){
			$("#update").modal("show");
			id=$($($(this).parent().parent()[0]).children()[0]).html();
			$('#name').val($($($(this).parent().parent()[0]).children()[1]).html());

		});
		
		$('#updateOrganisation').click(function(){

			var name=$('#name').val();
			$.ajax({
			  type: "POST",
			  data: {id: id,name:name},
			  url: '/management/updateOrganisation',
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
			$('#userInfo').text(name);
		});


		$('#deleteOrganisation').click(function(){
			$.ajax({
			  type: "POST",
			  data: {id: id},
			  url: '/management/deleteOrganisation',
			}).done(function(res){
				$("#delete").modal("hide");
				location.reload();

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
        <h4 class="modal-title" id="myModalLabel"><?php _e("Organizasyon Güncelle"); ?></h4>
      </div>
      <div class="modal-body">
        <form role="form">
		  <div class="form-group">
			<label for="name"><?php _e("İsim"); ?></label>
			<input type="text" name="name" class="form-control" id="name" placeholder="" value="">
		  </div>
		</form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal"><?php _e("Kapat"); ?></button>
	  	<a id="updateOrganisation" class="btn btn-success"><?php _e("Kaydet"); ?></a>
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
        <h4 class="modal-title" id="myModalLabel"><?php _e("Organizasyon Sil"); ?></h4>
      </div>
      <div class="modal-body">
      	<b id="userInfo"></b> <?php _e("adlı organizasyonu silmek istediğinizden emin misiniz?"); ?>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal"><?php _e("Kapat"); ?></button>
	  	<a id="deleteOrganisation" class="btn btn-success"><?php _e("Sil"); ?></a>
      </div>
    </div>
  </div>
</div>