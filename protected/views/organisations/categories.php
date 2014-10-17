<script>
	jQuery(document).ready(function() {	
		$('#li_<?php echo $organisationId; ?>').addClass('current');	
		App.setPage("gallery");  //Set current page
		App.init(); //Initialise plugins and elements

		$('#acl_info_box_event').click(function(){
			var box=$('#acl_info_box');
			console.log(box.css('display'));
			if(box.css('display')=='none')
				box.css({'display':'block'});
			else
				box.css({'display':'none'});



		});

		$('.close').bind('click', function (event,ui) {
			var id=$(this).data("id");
			var target=$(this).data("target");
			
			if(target=='#addCategory')
			{
				var data=JSON.parse(atob(id));
				console.log(data);

				var category_id=data.category_id;
				var category_name=data.category_name;
				var organisation_id=data.organisation_id;

				$('#acl').find('[name=category_name]').val(category_name);
				$('#acl').find('[name=status]').val(category_id);
			

				//$.each($('#acl').find('[name=type]'),function(i,val){console.log(val.value);});
			}
			else if(target=='#confirmation'){
				console.log('fssdf');
				$("#remove_ok").attr("data-id",id);
			}
			else if(target=='#addSubCategory')
			{
				
				$("#add_sub_category").attr("data-id",id);
				console.log("Add Sub category");
			}

		});

		function clearForm(){
			$('#acl').find('[name=category_name]').val("");
		}

		$('#confirmation').on('hidden.bs.modal', function () {
    		clearForm();
		});
		$('#addCategory').on('hidden.bs.modal', function () {

    		clearForm();
		});
		$('#remove_ok').bind('click', function (event,ui) {
			var id_acl =$(this).data("id");
			console.log(id_acl);

  			var organisation_id="<?php echo $organisationId; ?>";
  			console.log(organisation_id);
  			$.ajax(
	  					{
					  		type: "GET",
					  		url: "/organisations/deleteCategory/",
					  		data: { organisationId:organisation_id, category_id: id_acl }
						}
				  )
				  .done(
					  		function( msg ) 
					  		{
					    		console.log("access control list removed!");
					    		location.reload();
					  		}
				  		);
		});
	});
</script>
<!-- POPUP EDITORS -->
<div class="modal fade" id="addCategory" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
	  <div class="modal-content">
		<div class="modal-header">
		  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		  <h4 class="modal-title"><?php _e("Kategori Ekle"); ?></h4>
		</div>
		<div class="modal-body">
		 	<form id="acl" method="post" class="form-horizontal">
		 		<input type="hidden" name="status" value="">
				<div class="form-group">
					<label class="control-label col-md-3" for="category_name"><?php _e('Kategori Adı'); ?><span class="required">*</span></label>
					<div class="col-md-4">
						<input class="form-control" name="category_name" type="text">															
					</div>
				</div>
		 	</form>
		</div>
	      <div class="modal-footer">
	      	<button type="button" class="btn btn-primary" id="add_category"><?php _e("Ekle"); ?></a>
	        <button type="button" class="btn btn-default" data-dismiss="modal"><?php _e("Vazgeç"); ?></button>
	      </div>
		</div>
	  </div>
	</div>
 
<!-- POPUP END -->
<!-- POPUP SUBCATEGORY -->
<div class="modal fade" id="addSubCategory" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
	  <div class="modal-content">
		<div class="modal-header">
		  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		  <h4 class="modal-title"><?php _e("Alt Kategori Ekle"); ?></h4>
		</div>
		<div class="modal-body">
		 	<form id="acl" method="post" class="form-horizontal">
		 		<input type="hidden" name="status" value="">
				<div class="form-group">
					<label class="control-label col-md-3" for="sub_category_name"><?php _e('Alt Kategori Adı'); ?><span class="required">*</span></label>
					<div class="col-md-4">
						<input class="form-control" name="sub_category_name" type="text">															
					</div>
				</div>
		 	</form>
		</div>
	      <div class="modal-footer">
	      	<button type="button" class="btn btn-primary" id="add_sub_category"><?php _e("Ekle"); ?></a>
	        <button type="button" class="btn btn-default" data-dismiss="modal"><?php _e("Vazgeç"); ?></button>
	      </div>
		</div>
	  </div>
	</div>
 
<!-- POPUP SUBCATEGORY -->
<!--Confirmation starts-->
<!--
<div class="modal fade in" id="box-config-1" tabindex="-1" role="dialog" aria-labelledby="myModalLabelx" aria-hidden="false" style="display: block;">
<div class="modal-dialog">
  <div class="modal-content">
	<div class="modal-header">
	  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	  <h4 class="modal-title">Box Settings</h4>
	</div>
	<div class="modal-body">
	  Here goes box setting content.
	</div>
	<div class="modal-footer">
	  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
	  <button type="button" class="btn btn-primary">Save changes</button>
	</div>
  </div>
</div>
</div>
-->

<div class="modal fade" id="confirmation" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
	  <div class="modal-content">
		<div class="modal-header">
		  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		  <h4 class="modal-title"><?php _e("Kategori Sil"); ?></h4>
		</div>
		<div class="modal-body">
		Silmek istediğinizden emin misiniz?
		</div>
	      <div class="modal-footer">
	      	<button type="button" id="remove_ok" class="btn btn-primary" data-id="" id="remove_server"><?php _e("Evet"); ?></button>
	        <button type="button" class="btn btn-default" data-dismiss="modal"><?php _e("Hayır"); ?></button>
	      </div>
		</div>
	 </div>
</div>

<!--Confirmation ends-->

<div id="content" class="col-lg-12">
<!-- PAGE HEADER-->
<div class="row">
	<div class="col-sm-12">
		<div class="page-header">
				<h3 class="content-title pull-left"><?php _e('Kategori Listesi'); ?></h3>
					
				<a class="btn pull-right pageheader_button_margin brand_color_for_buttons" data-id="addCategory" data-toggle="modal" data-target="#addCategory"><i class="fa fa-plus-circle"></i><span> Kategori Ekle</span></a>
	
			
		</div>
	</div>
</div>


<div class="row">

<div class="box border blue" style="margin:20px;">
	<div id="acl_info_box_event" class="box-title">
		<h4 style="text-shadow:none"><i class="fa fa-info-circle"></i>Kategori Listesi hakkında bilgiler!</h4>
		<div class="tools">
				<i class="fa fa-chevron-down"></i>
		</div>
	</div>
	<div  id="acl_info_box" class="box-body big" style="display: none;">
		<div class="jumbotron">
		  <h2>Kategori listesi,</h2>
		  <p>Eserleri tasnif edilebilmesi için, eseriniz için en az bir kategori tanımlanmalıdır.</p>
		</div>	

	</div>
</div>



</div>
<div class="row">

<?php
 function category($category,$level){
	$category_data = array(
				'category_id'=>$category->category_id,
			   'category_name'=>$category->category_name,
			   'organisation_id'=>$category->organisation_id,
			   'periodical'=>$category->periodical,
			    );
	//$background_color=array("#d9edf7","#B2DEF3","#96D3F0","#7FCCF1","#67C3F0","#55BFF3","#3FB7F1");
	$background_color=array("#7FCCF1","#96D3F0","#B2DEF3","#d9edf7","#E2F0F6","#EFF3F5");

 	$category_data=base64_encode(json_encode($category_data));
 	$margin_level=(($level*50)+20)."px";
 	echo <<< EOT
			<div class="alert alert-block alert-info fade in" style="background-color:$background_color[$level];margin:20px;margin-left:$margin_level">

				<a class="fa fa-times-circle close tip" data-original-title="Kategoriyi Kaldır" data-id="$category->category_id" data-toggle="modal" data-target="#confirmation"></a>
				<a class="fa fa-edit close tip" data-original-title="Kategoriyi Düzenle" data-id="$category_data" style="margin-right:5px" data-toggle="modal" data-target="#addCategory"></a>
				<a class="fa fa-th-list close tip" data-original-title="Alt Kategori Ekle" data-id="$category->category_id" style="margin-right:5px" data-toggle="modal" data-target="#addSubCategory"></a>

				<p></p>

				<h4>
					<table>
						<tr>
							<td style="width:150px;">Kategori Adı</td>
							<td>$category->category_name</td>
						</tr>
					</table>
				</h4>
				<p></p>
			</div>
EOT;
		sub_category($category,$level);
 }

 function sub_category($category,$level)
 {
 		$sub_categories=OrganisationsController::retrieveSubCategories($category->category_id,$category->organisation_id);
 		
 		foreach ($sub_categories as $key => $sub_category_item) {
 			category($sub_category_item,$level+1);
 		}
 }



	if ($categories){

	foreach ($categories as $key => $category){

			?>
			
		



			<?php
			category($category,0);

			/*sub category begins*/
			//$sub_categories=$this->retrieveSubCategories($category->category_id,$category->organisation_id);

			/*sub category ends*/


			}
		}
	else
	{
		?>
		<div class="alert alert-block alert-warning fade in" style="margin:20px;">
				<p></p><h4><i class="fa fa-exclamation-circle"></i> Uyarı</h4>Henüz herhangi bir Kategori oluşturulmamış. Bu durum, eserlerinizin yayınlanmasına engel teşkil edecektir.<p></p>
		</div>
<?php
	}
?>



<?php
/*
	if ($acls) {
		 
		$acls=json_decode($acls,true);
		foreach ($acls as $key => $acl) {
			?>
			<div class="col-lg-12">
				<?php echo $acl['name']; ?><br>
				<?php echo $acl['type']; ?><br>
				<?php echo $acl['val1']; ?><br>
				<?php echo $acl['val2']; ?><br>
				<?php echo $acl['comment']; ?><br>
				<a href="/organisations/deleteACL/<?php echo $organisation_id; ?>?acl_id=<?php echo $acl['id']; ?>"><?php _e('Sil'); ?></a>
			</div>
			<br>
			<br><hr>
			<?php
		}
	}*/ 
?>
</div>
<!-- /PAGE HEADER -->
<script type="text/javascript">
 
$(document).on("click","#add_category",function(e){
	category_name=$('[name="category_name"]').val();
	status =$('[name="status"]').val();
	
		$.ajax({
		  type: "POST",
		  url: '/organisations/createBookCategory',
		  data: {organisationId:'<?php echo $organisationId;?>',category_name:category_name,status:status}
		}).done(function(res){
			console.log(res);
			window.location.assign('/organisations/bookCategories/'+'<?php echo $organisationId;?>');
		});

});
$(document).on("click","#add_sub_category",function(e){
	var sub_category_name = $('[name="sub_category_name"]').val();
	var category_id = $(this).data("id");
	console.log(sub_category_name,category_id);
		$.ajax({
		  type: "POST",
		  url: '/organisations/createBookSubCategory',
		  data: {organisationId:'<?php echo $organisationId;?>',category_id:category_id,sub_category_name:sub_category_name}
		}).done(function(res){
			console.log(res);
			window.location.assign('/organisations/bookCategories/'+'<?php echo $organisationId;?>');
		});

});
</script>