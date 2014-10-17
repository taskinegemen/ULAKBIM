
<?php

$this->pageTitle=Yii::app()->name." - ". __("Epub İndir");
//var_dump($book_data);
$bookData = $book_data[0];
$book_data_thumbnail = json_decode($bookData->data,true);
$thumbnailSrc = "/css/images/deneme_cover.jpg";
if (isset($book_data_thumbnail['thumbnail'])) {
	$thumbnailSrc=$book_data_thumbnail['thumbnail'];
}
?>


<script>
	jQuery(document).ready(function() {	
		//$('#li_dashboard').addClass('current');	
		App.setPage("index");  //Set current page
		App.init(); //Initialise plugins and elements
	});
</script>

<!-- PAGE -->
<div id="content" class="col-lg-12">
<!-- PAGE HEADER-->
<div class="row">
	<div class="col-sm-12">
		<div class="page-header">
			<h3 class="content-title pull-left"><?php  echo __("Epub İndir") ?></h3>
		</div>
	</div>
</div>
<!-- /PAGE HEADER -->
<div class="row">
							
	<div class="col-md-5 box-container ui-sortable">
		<!-- BOX WITH BIG HEADER-->
		<div class="box border primary">
			<div class="box-title small">
				<h4><i class="fa fa-book"></i> <?php echo strtoupper($bookData->title); ?></h4>							
	  		</div>

			<div class="box-body">
	  <div class="well">
	    <dl class="dl-horizontal">
												  <dt style="width:140px;">
	  <img src="<?php echo $thumbnailSrc;?>" alt="Smiley face" width="120px" class="pull-left">

	</dt>
												  <dd style="margin-left:140px;">
	<h4 style="font-weight:bold;"><?php echo $bookData->title; ?></h4>
	  <h5><?php echo $bookData->author; ?></h5>
	Ücretsiz indir seçeneği ile yayınınızı indirirseniz kitabınızın içerisine Okutus görselleri otomatik yerleştirilir. Eğer reklamsız indirmek istiyorsanız aşağıdaki butonu kullanınız.
	  <br><br>
	<a href="<?php echo Yii::app()->getBaseUrl(true);?>/EditorActions/ExportBook?bookId=<?php echo $bookData->book_id; ?>" class="btn btn-block pull-right  btn-primary btn-lg"><i class="fa fa-arrow-circle-down"></i> İndir </a>

	</dd>
		  
											  
										   </dl>
  <div class="clearfix"></div></div>


  <div class="row">
  
  <div class="col-sm-12">
  
  </div> 
  <div class="clearfix"></div>
</div>




</div>
								</div>
								<!-- /BOX WITH BIG HEADER-->
						
                              
						</div><div class="col-md-7">
								<!-- BOX WITH BIG HEADER-->
								<div class="box  ">
									<div class="box-title small">
										<h4><i class="fa fa-home"></i>Kitabınızı Nasıl Yayınlayabilirsiniz</h4>
										
									</div>
									<div class="box-body"><div class="panel-group" id="accordion">
										  <div class="panel panel-default">
											 <div class="panel-heading">
												<h3 class="panel-title"> <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">EPUB Dosyanız Hazır </a> </h3>
											 </div>
											 <div id="collapseOne" class="panel-collapse in" style="height: auto;">
												<div class="panel-body"><dl class="dl-horizontal">
											  <dt>
  <img src="http://dimension.tw/wp-content/uploads/2013/06/D41D8C_epub_logo_ralphburkhardt1.jpg" alt="Smiley face" width="100px" class="pull-left">

</dt>
											  <dd>EPUB ya da tam adıyla Electronic Publication, Uluslararası Sayısal Yayıncılık Forumu (IDPF) tarafından e-kitap standardı olarak ilan edilen, gömülü cihazlarda ve bilgisayarlarda kullanılmak üzere geliştirilmiş bir dosya biçimidir.
<br><br>
Gün geçtikçe yaygınlaşan bir e-kitap standardı olan EPUB, sayısal okuyucu ve e-mürekkep teknolojileri pazarının öncü firmaları tarafından artan bir şekilde destekleniyor. 2009 yılının ağustos ayında Sony, sahibi olduğu eBook yayınlama biçimini kullanmayı durdurup, açık kaynak kodlu olan ePub'a geçeceğini duyurdu. Sony'nin hemen ardından Google Books da telif hakları kamuya ait (public domain) 1.000.0000'dan fazla kitabı, özgür ePub biçimine çevirdiğini ilan etti.

<br>
<span style="font-weight:bold;"> ePub3 dosyaları nasıl okunur?</span><br>

ePub3 paketinizi aşağıdaki ücretsiz uygulamalarda açarak okuyabilirsiniz;
</dd>
											  
											  
											  
											  
											  
											  
											  
										   </dl></div>
											 </div>
										  </div>
										  <div class="panel panel-default">
											 <div class="panel-heading">
												<h3 class="panel-title"> <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">WEB</a> </h3>
											 </div>
											 <div id="collapseTwo" class="panel-collapse collapse" style="height: 0px;">
												<div class="panel-body"> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </div>
											 </div>
										  </div>
										  

<div class="panel panel-default">
											 <div class="panel-heading">
												<h3 class="panel-title"> <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree">Masaüstü</a> </h3>
											 </div>
											 <div id="collapseThree" class="panel-collapse collapse" style="height: 0px;">
												<div class="panel-body"> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </div>
											 </div>
										  </div>
<div class="panel panel-default">
											 <div class="panel-heading">
												<h3 class="panel-title"> <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseFour">Apple</a> </h3>
											 </div>
											 <div id="collapseFour" class="panel-collapse collapse" style="height: 0px;">
												<div class="panel-body"> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </div>
											 </div>
										  </div>

<div class="panel panel-default">
											 <div class="panel-heading">
												<h3 class="panel-title"> <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseFive">Google Play ile Yayınla </a> </h3>
											 </div>
											 <div id="collapseFive" class="panel-collapse collapse" style="height: 0px;">
												<div class="panel-body"> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </div>
											 </div>
										  </div>

									   </div></div>
								</div>
								<!-- /BOX WITH BIG HEADER-->
						
                              
						</div>
  
</div>

							</div>
						</div>
</div>
<!--/PAGE -->



    