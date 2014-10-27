<?php
 
class LepubController extends Controller
{
	//public $layout = '//layouts/column2';
	/**
	 * Declares class-based actions.
	 */
  public function init()
  {
        $this->layout = false;
  }
	public function actionExport($bookId)
	{

  		$serialized_book_path=Yii::app()->params['serialized'].$bookId;
  		$this->makeDir($serialized_book_path);

		$book=Book::model()->find('book_id=:book_id',array('book_id'=>$bookId));
  		$serialized_book = serialize($book);

  		$chapters=Chapter::model()->findAll('book_id=:book_id',array('book_id'=>$bookId));
  		$serialized_chapters=serialize($chapters);

  		$pages=array();
  		$components=array();
  		foreach ($chapters as $chapter) {
  			$pages_all=Page::model()->findAll('chapter_id=:chapter_id',array('chapter_id'=>$chapter->chapter_id));
  			foreach ($pages_all as $page) {
  				$pages[]=$page;
  				$components_all=Component::model()->findAll('page_id=:page_id',array('page_id'=>$page->page_id));
  				foreach ($components_all as $component) {
  					$components[]=$component;
  					if($component->type=="video")
  					{
  						$video=json_decode(base64_decode($component->data));
  						$video_path=$video->source->attr->src;
  						$video_path_parsed=explode("/",$video_path);
  						$video_name=$video_path_parsed[sizeof($video_path_parsed)-1];
  						echo $serialized_book_path."/".$video_name;
  						echo copy(Yii::app()->params['storage'].$bookId."/".$video_name, $serialized_book_path."/".$video_name);
  					}
  				}
  			}
  			
  		}
  		$serialized_pages=serialize($pages);
  		$serialized_components=serialize($components);

  		file_put_contents($serialized_book_path.'/book.ser', $serialized_book);
   		file_put_contents($serialized_book_path.'/chapters.ser', $serialized_chapters);
   		file_put_contents($serialized_book_path.'/pages.ser', $serialized_pages);  		
   		file_put_contents($serialized_book_path.'/components.ser', $serialized_components); 

   		exec("cd ".$serialized_book_path.";zip -o -r ../".$bookId.".lepub .");
      exec("rm -rf ".$serialized_book_path);
   		$this->exportLepub($serialized_book_path.".lepub");


	}
	public function actionImport($bookId,$workspace_id,$lepub_type)
	{

		

  		$serialized_book_path=Yii::app()->params['serialized'].$bookId;
  		exec("cd ".Yii::app()->params['serialized'].";unzip -o ".$serialized_book_path.".".$lepub_type." -d ".$bookId);

  		$users=User::model()->findAll();
  		$current_user=$users[0];
  		
      if($lepub_type=="lepub")
      {  
          		$serialized_book=unserialize(file_get_contents($serialized_book_path.'/book.ser'));
           		$serialized_chapters=unserialize(file_get_contents($serialized_book_path.'/chapters.ser'));
           		$serialized_pages=unserialize(file_get_contents($serialized_book_path.'/pages.ser'));  		
           		$serialized_components=unserialize(file_get_contents($serialized_book_path.'/components.ser'));

           		$new_book_id=$this->createUniqueId(Book,'book_id');
           		$storage_path=Yii::app()->params['storage'].$new_book_id;
           		$this->makeDir($storage_path);

           		$new_book=new Book();
           		$new_book->attributes=$serialized_book->attributes;

           		$new_book->book_id=$new_book_id;
           		$new_book->workspace_id=$workspace_id;//"yBwFA9U1KsdGXuAQO54Cskw7nVRt8NfdYlRbVxb7t8Pu";
           		if($new_book->save())
           		{
           			echo $new_book->book_id;
           			$new_book_user=new BookUsers();
           			$new_book_user->user_id=$current_user->id;
           			$new_book_user->book_id=$new_book_id;
           			$new_book_user->type="owner";
           			$new_book_user->created=date('Y-m-d G:i:s');
           			if($new_book_user->save())
           			{
           				foreach ($serialized_chapters as $chapter) {
           					$chapter_id=$chapter->chapter_id;
           					$new_chapter_id=$this->createUniqueId(Chapter,'chapter_id');
           					$new_chapter=new Chapter();
           					$new_chapter->attributes=$chapter->attributes;
           					$new_chapter->chapter_id=$new_chapter_id;
           					$new_chapter->book_id=$new_book_id;
           					if($new_chapter->save())
           					{
           						foreach ($serialized_pages as $page) {
           							$page_id=$page->page_id;
        		   					$new_page_id=$this->createUniqueId(Page,'page_id');
        		   					$new_page=new Page();
        		   					$new_page->attributes=$page->attributes;
        		   					$new_page->page_id=$new_page_id;
        		   					$new_page->chapter_id=$new_chapter_id;
        		   					if($new_page->save())
        		   					{
                          /*component list begins*/
        		   						foreach ($serialized_components as $component) 
        		   						{
                            if($component->page_id==$page_id){
        		   							$component_id=$component->id;
        				   					$new_component_id=$this->createUniqueId(Component,'id');
        				   					$new_component=new Component();
        				   					$new_component->attributes=$component->attributes;
        				   					$new_component->id=$new_component_id;
        				   					$new_component->page_id=$new_page_id;
        				   					$new_component->type=$component->type;
        				   					
        				   					if($new_component->type=="video")
        				   					{
        				   						$data=json_decode(base64_decode($new_component->data));
        				   						$video_path=$data->source->attr->src;
        				  						$video_path_parsed=explode("/",$video_path);
        				  						$video_name=$video_path_parsed[sizeof($video_path_parsed)-1];

        				  						$new_video_id=functions::get_random_string();

        				  						copy($serialized_book_path."/".$video_name,$storage_path."/".$new_video_id.".mp4");

        				   						$data->source->attr->src=Yii::app()->request->getBaseUrl(true)."/uploads/files/".$new_book_id."/".$new_video_id.".mp4";
        				   						$new_component->data=base64_encode(json_encode($data));

 




        				   					}
        				   					if($new_component->save())
        				   					{
        				   						
                              
        				   					}
        				   					else
        				   					{
        				   						print_r($new_component->getErrors());
        				   					}

                          }

        		   						}
                          
                          /*component list ends*/
        		   					}
        		   					else
        		   					{
        		   						print_r($new_page->getErrors());
        		   					}
           						}

           					}
           					else
           					{
           						print_r($new_chapter->getErrors());
           					}





           				}
           			}
           			else
           			{
           				print_r($new_book_user->getErrors());
           			}

           		}
           		else
           		{
           			print_r($new_book->getErrors());
           		}
              exec("rm -rf ".$serialized_book_path);
              unlink($serialized_book_path.".lepub");
        	  	$this->redirect(array('Book/author', 'bookId'=>$new_book_id));	
      }
      else if($lepub_type=="epub")
      {
        echo "TODO:epub import not finished yet!";
      }


	}
	private function createUniqueId($Model,$id_field)
	{
		do
		{
			$new_id=functions::get_random_string();
			$model=$Model::model()->find($id_field.'=:'.$id_field,array(':'.$id_field => $new_id));
		}
		while($model);
		return $new_id;
	}
	private function exportLepub($filename)
	{
		// send $filename to browser
		$finfo = finfo_open(FILEINFO_MIME_TYPE);
		$mimeType = finfo_file($finfo, $filename);
		$size = filesize($filename);
		$name = basename($filename);
    /*
    header("Cache-Control: public"); 
    header("Content-Description: File Transfer"); 
    header('Content-Type: application/pdf'); 
    header("Content-Transfer-Encoding: binary"); 
		header('Content-Disposition: attachment; filename="' . $name . '";');
		header("Accept-Ranges: bytes");
		readfile($filename);
		exit;*/
      header('Content-Description: File Transfer');
      header('Content-Type: application/lepub');
      header('Content-Disposition: attachment; filename='.$name);
      header('Content-Transfer-Encoding: binary');
      header('Expires: 0');
      header('Cache-Control: must-revalidate');
      header('Pragma: public');
      header('Content-Length: ' . $size);
      ob_clean();
      flush();
      readfile($filename);
      unlink($filename);
      die;
	}

	private function makeDir($path)
	{
	     return is_dir($path) || mkdir($path);
	}
}
