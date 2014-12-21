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
      exec("chmod -R 777 ".$serialized_book_path);
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
								$new_page->pdf_data=$page->pdf_data;
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
        /*
        echo "TODO:epub import not finished yet!...";
        print_r($bookId);
        print_r($workspace_id);
        print_r($lepub_type);*/

        $xml=simplexml_load_file($serialized_book_path."/META-INF/container.xml");
        //print_r($serialized_book_path."/META-INF/container.xml");
        //var_dump($xml);
        foreach ($xml->rootfiles->rootfile->attributes() as $key => $value) {
          if($key=="full-path")
          {
            $full_path=$value;
          }
        }

        $full_path_array=split("/", $full_path);
        foreach ($full_path_array as $item) {
          $matches=array();
          preg_match("/.+\.opf/", $item, $matches, PREG_OFFSET_CAPTURE);
          if(empty($matches))
          {
            $serialized_book_path.="/".$item;
          }
          else
          {
            $opf_name=$item;
          }
        }

      /*begin find chapters*/
      $toc_points=array();
      $toc_paths=glob($serialized_book_path."/toc.ncx");
      $chapters=array();
      if(sizeof($toc_paths)==1)
      {
        $toc_path=$toc_paths[0];
        $toc_xml=simplexml_load_file($toc_path);
        foreach ($toc_xml->navMap as $navPoint) {
          foreach ($navPoint as $point) {
            $toc_points[]=$this->xml_attribute($point,"id");
          }
        }
      }
      /*end find chapter*/

        $results=glob($serialized_book_path."/".$opf_name);//"/package.opf"
        $idrefs=array();
        if(sizeof($results)==1)
        {
          $opf=$results[0];
          $xml=simplexml_load_file($opf);


          foreach ($xml->spine->itemref as $item) {
            $idref=$this->xml_attribute($item,"idref");
            $idrefs[$idref]=$idref;
            /*chapter identification begin*/
            $idrefs_chapters=array();
            if(in_array($idref, $toc_points))
            {
              $idrefs_chapters=$idref;
            }
            /*chapter identification end*/
          }
 

        
          foreach ($xml->manifest->item as $item) {
              $id=$this->xml_attribute($item,"id");

              if(in_array($id,$idrefs))
              {
                $href=$this->xml_attribute($item,"href");
                $idrefs[$id]=$href;
              }
          }
          //print_r($idrefs);


          /*Book metadata begin*/
          $metas=$xml->metadata->children("http://purl.org/dc/elements/1.1/");
          $meta=array(
              "title"=>$metas->title->__toString(),
              "author"=>$metas->creator->__toString(),
              "created"=>date("Y-m-d H:i:s")
            );
          //print_r($meta);
          /*Book metadata end*/


          $book=new Book();
          $book->title=$meta["title"];
          $book->author=$meta["author"];
          $book->created=$meta["created"];

          $book->workspace_id=$workspace_id;
          $book->book_id=$bookId;
          $book->data='{"book_type":"epub","size":{"width":"1280","height":"960"},"template_id":""}';
          //print_r("boooookkk saving.....");
          if($book->save()){
              $new_book_user=new BookUsers();
              $new_book_user->user_id=$current_user->id;
              $new_book_user->book_id=$bookId;
              $new_book_user->type="owner";
              $new_book_user->created=date('Y-m-d G:i:s');
              if($new_book_user->save())
              {
                $new_chapter_id=$this->createUniqueId(Chapter,'chapter_id');
                $new_chapter=new Chapter();
                $new_chapter->chapter_id=$new_chapter_id;
                $new_chapter->book_id=$new_book_user->book_id;
                $new_chapter->title="Bölüm 1";
                if($new_chapter->save())
                {
                  $order=0;
                  foreach ($idrefs as $single_page) 
                  {
                      /*iterate over pages begin*/
                      $order++;
                      $new_page_id=$this->createUniqueId(Page,'page_id');
                      $new_page=new Page();
                      $new_page->page_id=$new_page_id;
                      $new_page->order=$order;
                      $new_page->chapter_id=$new_chapter_id;
                      if($new_page->save())
                      {
                        $full_path=$serialized_book_path."/".$single_page;

                        $html_data=file_get_contents($full_path);
                        //$html_data=$this->changeReferencesWithContent($serialized_book_path,$html_data);
                        $html_data=$this->changeSourcePath($html_data,$bookId,$opf);
                        file_put_contents($full_path, $html_data);
                        $data=$this->encodeURI($html_data);
                        $size=$this->createBookSize($html_data);
                        if($order==1)
                        {
                          $book_size=$size;
                        }
                        //print_r("SIZE=>");print_r($size);
                        $html_component=$this->createHtmlComponent($data,$size["width"],$size["height"]);
                        //$html_component=$this->createHtmlComponent($full_path,$serialized_book_path);
                        
                        $new_component_id=$this->createUniqueId(Component,'id');
                        $new_component=new Component();
                        $new_component->id=$new_component_id;
                        $new_component->page_id=$new_page_id;
                        $new_component->type="html";
                        $new_component->data=$html_component;
                        if($new_component->save())
                        {
                          copy($full_path,Yii::app()->params['storage'].$new_component->id.".html");
                        }
                        else
                        {
                          print_r("Component errors");
                          print_r($new_component->getErrors());
                        }



                      }
                      else
                      {
                        print_r("PAGE errors");
                        print_r($new_page->getErrors());
                      }
                      /*iterate over pages end*/
                  }
                  //$size=$this->createBookSize(file_get_contents($full_path));
                  $size=$book_size;
                  $book_link=Yii::app()->getBaseUrl(true)."/serialized/".$bookId."/";
                  $book->data='{"book_type":"epub","size":{"width":"'.$size["width"].'","height":"'.$size["height"].'"},"template_id":"","imported_epub":"'.$book_link.'"}';
                  $book->save();

 

                }
              }
              else
              {
                print_r($book->getErrors());
              }
          }
          else
          {
              print_r($book->getErrors()); 
          }

        }
        else
        {
          print_r("Error:more than one .opf files found!<br>");
          print_r($results);
        }
        //echo "HI GUYS";
          unlink($serialized_book_path.".epub");
          $this->redirect(array('Book/author', 'bookId'=>$bookId)); 

      }


	}
  private function encodeURI($uri)
  {
      return preg_replace_callback("{[^0-9a-z_.!~*'();,/?:@&=+$#]}i", function ($m) {
              return sprintf('%%%02X', ord($m[0]));
          }, $uri);
  }
  private function createBookSize($html_data){

    $matches=array();
    $re = "/content=\\\"(.*)=(.*)[, ](.*)=(.*)\\\"/"; 
    preg_match_all($re, $html_data, $matches);
    if(!empty($matches))
    {

      //print_r($matches);
      if($matches[1][0]=="width")
      {
        return array("width"=>trim($matches[2][0],",. "),"height"=>trim($matches[4][0],",. "));
      }
      else if($matches[1][0]=="height")
      {
        return array("width"=>trim($matches[4][0],",. "),"height"=>trim($matches[2][0],",. "));       
      }
    }

      return array("width"=>1280,"height"=>960);

  }
  private function changeSourcePath($html_data,$bookId,$opf_path)
  {
    //print_r("HTML PATH-><br>".$opf);

    $book_path=Yii::app()->getBaseUrl(true)."/serialized/".$bookId."/";
    $opf = "/serialized\\/".$bookId."\\/(.+)\\/.+\\.opf/"; 
    $src = "/src=[\"']([\\w\\d\\/\\?._-]+)[\"']/"; 
    $href = "/href=[\"']([\\w\\d\\/\\?._-]+)[\"']/"; 
    $poster = "/poster=[\"']([\\w\\d\\/\\?._-]+)[\"']/"; 

    /*for opf*/
    $matches=array();
    preg_match($opf, $opf_path,$matches);
    if(sizeof($matches))
    {
      $book_path.=$matches[1]."/";
    }

    /*for srcs*/
    $matches=array();
    preg_match_all($src, $html_data, $matches);
    if(sizeof($matches))
    {
      foreach ($matches[1] as $match) 
      {
        $html_data=str_replace($match, $book_path.$this->replacePrefix($match), $html_data);
      }
    }

    /*for hrefs*/
    $matches=array();
    preg_match_all($href, $html_data, $matches);
    if(sizeof($matches))
    {
      foreach ($matches[1] as $match) 
      {
        $html_data=str_replace($match, $book_path.$this->replacePrefix($match), $html_data);
      }
    }

    /*for posters*/
    $matches=array();
    preg_match_all($poster, $html_data, $matches);
    if(sizeof($matches))
    {
      foreach ($matches[1] as $match) 
      {
        $html_data=str_replace($match, $book_path.$this->replacePrefix($match), $html_data);
      }
    }

    return $html_data;





  }
  private function replacePrefix($match)
  {
    $data=str_replace("./", "", $match);
    $data=str_replace("../", "", $match);
    return $data;
  }
  private function changeReferencesWithContent($root_path,$html_data)
  {
      /*css change begins*/
      //<link href="css/epub.css" type="text/css" rel="stylesheet" />
      $matches=array();
      $re = "/(<link.*\\/>)/"; 
      preg_match_all($re, $html_data, $matches);
      //var_dump($matches);
      foreach ($matches[0] as $match) 
      {
        //print_r($match[0]);
        $doc=DOMDocument::loadXML($match);
        $nodes=$doc->getElementsByTagName('link');
        for($i=0;$i<$nodes->length;$i++)
        {
            $node=$nodes->item($i);
            $is_css=false;
            $css_src="";
            foreach($node->attributes as $attr)
              {
                //print_r($attr->name."=>".$attr->value);
                if($attr->name=="href")
                {
                  $css_src=$attr->value;
                }
                if($attr->name=="rel" && $attr->value=="stylesheet")
                {
                  $is_css=true;
                }
              }
            if($is_css && $css_src!="")
            {
              //print_r("<br>".$css_src."<br>");
              $css_source="<style>".file_get_contents($root_path."/".$css_src)."</style>";
              $html_data=str_replace($match, $css_source, $html_data);
            }  
        }
      }
      /*css change ends*/

      /*img change begins*/
      $matches=array();
      $re = "/(<img[^+]*>.*<\\/img>)|(<img[^+]*\\/>)|(<img[^+]*>)/"; 
      preg_match($re, $html_data, $matches);
      //print_r("IMAGE=><br>");
      //var_dump($matches);
      foreach ($matches as $match) 
      {
        if($match!="")
        {
            print_r("MATCH=><br>");
            print_r($match);
            $doc=DOMDocument::loadXML($match);
            if($doc)
              {
                  $nodes=$doc->getElementsByTagName('img');
                  for($i=0;$i<$nodes->length;$i++)
                  {
                      $node=$nodes->item($i);
                      $is_img=false;
                      $img_src="";
                      foreach($node->attributes as $attr)
                        {
                          //print_r($attr->name."=>".$attr->value);
                          if($attr->name=="src")
                          {
                            $img_src=$attr->value;
                          }
                        }
                      if($img_src!="")
                      {
                        //print_r("<br>".$img_src."<br>");
                        $img_source=file_get_contents($root_path."/".$img_src);
                        $type = pathinfo($img_src, PATHINFO_EXTENSION);
                        $base64 = 'data:image/' . $type . ';base64,' . base64_encode($img_source);

                        $temp_match=preg_replace('/src=".*"/', 'src="'.$base64.'"', $match);
                        //print_r($temp_match);
                        $html_data=str_replace($match, $temp_match, $html_data);
                      }  
                  }
              }
        }
      }      
      /*img change ends*/

      /*audio change begins*/
      /*audio change ends*/

      /*video change begins*/
      /*video change ends*/




      return $html_data;

  }

  private function createHtmlComponent($data,$width=1280,$height=960)
  {

    /*
    $html_data=file_get_contents($full_path);
    $html_data=$this->changeReferencesWithContent($root_path,$html_data);
    file_put_contents($full_path, $html_data);
    $data=$this->encodeURI($html_data);
    $size=$this->createBookSize($html_data);*/


    $html=array(
                  "html_inner"=>$data,
                  "overflow"=>"visible",
                  "lock"=>"",
                  "self"=>array("css"=>array(
                                            "position"=>"absolute",
                                            "top"=>"0px",
                                            "left"=>"0px",
                                            "overflow"=>"visible",
                                            "opacity"=>"1",
                                            "width"=>$width."px",
                                            "height"=>$height."px",
                                            "z-index"=>900
                                            )
                                ),
                  "comments"=>""
                );
    return base64_encode(json_encode($html));
  }
  private function xml_attribute($object, $attribute)
  {
    if(isset($object[$attribute]))
        return (string) $object[$attribute];
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
