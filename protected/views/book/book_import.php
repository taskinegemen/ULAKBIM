<?php
//print_r($workspaces);
?>
<!--
<section>
	<div id="content" class="col-lg-12">
    
	    <br>
	    <div class="page-header">
				<h3 class="content-title pull-left">(L)Epub Yükle</h3>
		</div>
	    <div class="col-md-10">
			<div class="panel panel-default">
			    <div class="panel-body">This page is temporarily disabled by the site administrator for some reason.</div> 
			    <div class="panel-footer clearfix">
			        <div class="pull-right">
			            <a href="#" class="btn btn-primary">Learn More</a>
			            <a href="#" class="btn btn-default">Go Back</a>
			        </div>
			    </div>
			</div>
		</div>
	</div>
</section>

-->

<script type="text/javascript">
	function formatSizeUnits(bytes){
        if      (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(2)+' GB';}
        else if (bytes>=1000000)    {bytes=(bytes/1000000).toFixed(2)+' MB';}
        else if (bytes>=1000)       {bytes=(bytes/1000).toFixed(2)+' KB';}
        else if (bytes>1)           {bytes=bytes+' bytes';}
        else if (bytes==1)          {bytes=bytes+' byte';}
        else                        {bytes='0 byte';}
        return bytes;
	}
	$(document).ready(function(){

		$('#lepub_submit').click(function(){
			$('#ProgressingModal').modal({backdrop: 'static',keyboard: false});
		});
		$('#lepub_drop').on(
    		'dragover',
	    function(e) 
		    {
		        e.preventDefault();
		        e.stopPropagation();
		    }
		);
	$('#lepub_drop').on(
	    'dragenter',
	    function(e) {
	        e.preventDefault();
	        e.stopPropagation();
	    }
	);

	$('#lepub_drop').on(
    'drop',
    function(e){
        if(e.originalEvent.dataTransfer){
            if(e.originalEvent.dataTransfer.files.length) {
                e.preventDefault();
                e.stopPropagation();
                /*UPLOAD FILES HERE*/
                console.log(e.originalEvent.dataTransfer.files);
                var lepubfile=e.originalEvent.dataTransfer.files[0];
                var reader = new FileReader();

                reader.onload = (function(theFile) {
			        return function(e) {
			          $('#lepub_file').val(e.target.result);
			        };
			      })(lepubfile);
			    reader.onprogress=(function(evt){
			    	if (evt.lengthComputable) {
				      var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
				      // Increase the progress bar length.
				      var lepub_progress=$('#lepub_progress');
				      lepub_progress.css({'width':percentLoaded+"%"});
				      lepub_progress.html("<b>"+percentLoaded+"%</b>");
				      
				    }
			    	console.log("a");
			    });

      			// Read in the image file as a data URL.
      			if(lepubfile.type =='application/epub+zip' || lepubfile.type =='application/lepub')
      			{
      				
      				if(lepubfile.type=='application/epub+zip')
      				{
      					$("#lepub_type").val('epub');
      				}
      				else if(lepubfile.type=='application/lepub')
      				{
      					$("#lepub_type").val('lepub');
      				}
      				reader.readAsDataURL(lepubfile);
      				$("#lepub_submit").attr("disabled",false);
                    $('#lepub_info').css({'display':'block'});
	                $('#lepub_name').html(lepubfile.name);
	                $('#lepub_type').html(lepubfile.type);
	                $('#lepub_size').html(formatSizeUnits(lepubfile.size));
      			}
      			else
      			{
      				$("#lepub_submit").attr("disabled",true);
      				$('#lepub_info').css({'display':'none'});
      				$('#ErrorModal').modal('show');
      			}


            }   
        }
    }
);


	

	});
</script>

<!--Lepub error window BEGIN-->
<div class="modal fade" id="ErrorModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title" id="myModalLabel">Hata</h4>
      </div>
      <div class="modal-body">
        Lütfen <b>.epub</b> yada <b>.lepub</b> uzantısına sahip dosyalar yükleyiniz!
        <br><br>
        Eğer uzantısı <b>.epub</b> yada <b>.lepub</b> uzantılı bir dosya yükleyip yine bu hata ile karşılaşıyorsanız, lütfen bilgisayarınızda bu uzantılara ait mime-type türlerinin tanıtılıp tanıtılmadığına emin olunuz!
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <!--<button type="button" class="btn btn-primary">Save changes</button>-->
      </div>
    </div>
  </div>
</div>
<!--Lepub error window END-->

<!--Progressing window BEGIN-->
<div class="modal fade" id="ProgressingModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-body">
      	<p align="center">
			<img src="<?php echo Yii::app()->request->baseUrl; ?>/css/loading.gif">
		</p>
		<p align="center">
			(L)Epub işleniyor...Lütfen bekleyiniz!
		</p>
      </div>
    </div>
  </div>
</div>
<!--Progressin window END-->
<br><br>
<section>
	<div id="content" class="col-lg-12">
    <div class="page-header">
			<h3 class="content-title pull-left">(L)Epub Yükle</h3>
		</div>
    
							<div class="col-md-10 creating_book_box">
							<?php echo CHtml::beginForm(); ?>
								    <div class="panel" style="border:1px solid #5ea5bd">
									      <div class="panel-heading" style="background-color:#70afc4">
									        <!--<h3 class="panel-title">Panel title</h3>-->
									        	<h4 style="color:white"><i class="fa fa-book"></i><?php _e('Uygun çalışma alanı belirleyip (L)Epub dosyanızı yükleyiniz!'); ?></h4>
									      </div>

									      <div class="panel-body">
									        	<div class="form-group">
									        	

													<label for="radio" class="control-label col-md-5"><?php _e('Çalışma Grubu'); ?><span class="required">*</span><span class="label label-danger"><?php echo $LepubForm->getErrors()['workspace'][0];?></span></label>
													<div class="col-md-7">
														<span id="workspaces">
															<?php 
															$i=0;
															foreach ($workspaces as $workspace): ?>
															<div class="" id="uniform-workspaces_<?php echo $i; ?>">
																<span class="checked">
																	<input id="workspaces_<?php echo $i; ?>" value="<?php echo $workspace['workspace_id']; ?>" checked="checked" type="radio" name="LepubForm[workspace]">
																</span>
															<label for="workspaces_<?php echo $i; ?>"><?php echo $workspace["workspace_name"]; ?></label><br>
															</div>
															<?php 
															$i++;
															endforeach; ?>
														</span>
													</div>

												<label for="radio" class="control-label col-md-5"><?php _e('(L)EPub Yükle'); ?><span class="required">*</span><br><span class="label label-danger"><?php echo $LepubForm->getErrors()['lepub_file'][0];?></span></label>
												<div class="col-md-7" id="lepub_drop" style="border-style:dashed"><!--add-lepub-drag-area-->
													<input type="hidden" name="LepubForm[lepub_file]" id="lepub_file">
													<input type="hidden" name="LepubForm[lepub_type]" id="lepub_type">
													<p style="text-align:center;padding:30px;">(L)Epub dosyasını bu alana sürükleyip bırakınız...</p>
													<div id="lepub_info" style="display:none">
														<p><b>Dosya Adı:</b><span id="lepub_name"></span></p>
														<p><b>Dosya Tipi:</b><span id="lepub_type"></span></p>
														<p><b>Dosya Boyutu:</b><span id="lepub_size"></span></p>
														<div class="progress">
															  <div id="lepub_progress" class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
															  </div>
														</div>
													</div>
												</div>
											</div>
									      </div>
									      <div class="panel-footer clearfix">
									      	<div class="span7 text-center">
									      		<!--<a href="" class="btn btn-success submitBtn" id="lepub_submit" style="display: inline-block;">Oluştur <i class="fa fa-arrow-circle-right"></i></a>-->
									      		<button type="submit" disabled="true" class="btn btn-success" id="lepub_submit">Oluştur <i class="fa fa-arrow-circle-right"></i></button>
									      	</div>
									      </div>
								    </div>
								<!-- BOX -->
	</div>
	<?php echo CHtml::endForm(); ?>
</section>

