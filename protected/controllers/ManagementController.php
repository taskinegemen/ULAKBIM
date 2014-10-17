<?php

class ManagementController extends Controller
{
	/**
	 * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
	 * using two-column layout. See 'protected/views/layouts/column2.php'.
	 */
	public $layout='//layouts/column2';

	/**
	 * @return array action filters
	 */
	public function filters()
	{
		return array(
			'accessControl', // perform access control for CRUD operations
			//'postOnly + delete', // we only allow deletion via POST request
		);
	}


	/**
	 * Specifies the access control rules.
	 * This method is used by the 'accessControl' filter.
	 * @return array access control rules
	 */
	public function accessRules()
	{
		return array(
			array('allow', // allow admin user to perform 'admin' and 'delete' actions
				'actions'=>array('index','organisations','users','view','updateUser','delete','resetPassword','sendMail','organisation','updateOrganisation','deleteOrganisation','books','getBookUsers','getAllUsers','deleteBookUser'),
				'users'=>array('admin'),
			),
			array('deny',  // deny all users
				'users'=>array('*'),
			),
		);
	}

	public function actionView($id){
		echo $id;
	}

	public function actionIndex(){
		$this->render('index');

	}
	public function actionUsers($filter=""){
		$this->render('users');
		
		$condition="";
	 	//$filter=$_POST['filter'];
		 if ($filter) {
		 	$condition="name LIKE '%".$filter."%' OR surname LIKE '%".$filter."%' OR email LIKE '%".$filter."%'";
		 }

		$dataProvider=new CActiveDataProvider('User', array(
		    'criteria'=>array(
		    	'condition'=>$condition,
		    ),
		    'sort'=>array('defaultOrder'=>'LOWER(name)','attributes'=>array(
		    		'name'=>array(
		    			"asc"=>"LOWER(name)",
		    			"desc"=>"LOWER(name) DESC",
		    		),
		    		'surname'=>array(
		    			"asc"=>"LOWER(surname)",
		    			"desc"=>"LOWER(surname) DESC",
		    		),
		    		'email'=>array(
		    			"asc"=>"LOWER(email)",
		    			"desc"=>"LOWER(email) DESC",
		    		),
		    	)

		    ),
		    'countCriteria'=>array(
		        // 'order' and 'with' clauses have no meaning for the count query
		    ),
		    'pagination'=>array(
		        'pageSize'=>20,
		    ),
		));
		 $dataProvider->getData(); //will return a list of Post objects

		$this->widget('zii.widgets.grid.CGridView', array(
		    'dataProvider'=>$dataProvider,
		    'columns'=>array(
		    	'id',
		        'name',
		        'surname',
		        'email',
      			//'htmlOptions' => array('class' => 'datatable table table-striped table-bordered table-hover dataTable'),
		        array( 
		            'class'=>'CButtonColumn',
		            'template'=>'{reset}{email}{guncelle}{sil}',
				    'buttons'=>array(
				        'email' => array(
				            'label'=>'&nbsp;&nbsp;',
				            //'imageUrl'=>Yii::app()->request->baseUrl.'/images/email.png',
				            // 'url'=>'Yii::app()->createUrl("users/email", array("id"=>$data->id))',
				            'url'=>'"#"',
				            'options'=>array("class"=>'fa fa-envelope sendEmail management-users-buttons','title'=>'Eposta Gönder'),
				        ),
				        'guncelle' => array(
				            'label'=>'&nbsp;&nbsp;',
				            'url'=>'"#"',
				            //'visible'=>'$data->score > 0',
				            'options'=>array("class"=>'fa fa-pencil-square-o update management-users-buttons','title'=>'Düzenle'),
				        ),
				        'sil' => array(
				            'label'=>'&nbsp;&nbsp;',
				            'url'=>'"#"',
				            //'visible'=>'$data->score > 0',
				            //'options'=>array("onclick"=>'openUpdateModal(100)'),
				            'options'=>array("class"=>'fa fa-times delete management-users-buttons','title'=>'Sil'),
				        ),
				        'reset' => array(
				            'label'=>'&nbsp;&nbsp;',
				            'url'=>'"#"',
				            //'visible'=>'$data->score > 0',
				            'options'=>array("class"=>'fa fa-key resetPassword management-users-buttons','title'=>'Şifre Yenile'),
				        ),
				    ),
		        ),
		    ),
		));
	}

	public function actionSendMail(){
		$id=$_POST['id'];
		if ($id) {
			$user=User::model()->findByPk($id);
			
			$message=$_POST['message'];
			$mail=new Email;
			$mail->setTo(array($user->email));
			$mail->setSubject('OKUTUS|Yöneticiden Mesaj');
			$mail->setFile('10Admin-mails.html');
			$mail->setAttributes(array('title'=>'OKUTUS|Yöneticiden Mesaj','message'=>$message));




			if($mail->sendMail()) {
				echo "1";
			}else{
				echo "Mail gönderilemedi! Lütfen tekrar deneyin.";
			}
		}
	}

	public function actionDeleteBookUser($userId,$bookId){

		$bookUser=BookUsers::model()->find('user_id=:user_id AND book_id=:book_id',array('user_id'=>$userId,'book_id'=>$bookId));
		$bookUser->delete();
		$this->redirect('books');
	}

	public function actionDelete(){
		$id=$_POST['id'];
		if ($id) {
			$user=User::model()->findByPk($id);
			if ($user) {
				if ($user->delete()) {
					echo "1";
				}
				else{
					echo "Kullanıcı silinemedi!";
				}
			}else{
				echo "Kullanıcı Bulunamadı!";
			}
		}else{
			echo "ID Bulunamadı!";
		}
	}

	public function actionDeleteOrganisation(){
		$id=$_POST['id'];
		if ($id) {
			$organisation=Organisations::model()->findByPk($id);
			if ($organisation) {
				if ($organisation->delete()) {
					echo "1";
				}
				else{
					echo "Organizasyon silinemedi!";
				}
			}else{
				echo "Organizasyon Bulunamadı!";
			}
		}else{
			echo "ID Bulunamadı!";
		}
	}

	public function actionUpdateUser(){
		$id=$_POST['id'];
		if ($id) {
			$user=User::model()->findByPk($id);
			if ($user) {
				$user->name=$_POST['name'];
				$user->surname=$_POST['surname'];
				$user->email=$_POST['email'];
				if ($user->save()) {
					echo "1";
				}
				else{
					echo "Kullanıcı güncellenemedi!";
				}
			}else{
				echo "Kullanıcı Bulunamadı!";
			}
		}else{
			echo "ID Bulunamadı!";
		}
	}

	public function actionUpdateOrganisation(){
		$id=$_POST['id'];
		if ($id) {
			$organisation=Organisations::model()->findByPk($id);
			if ($organisation) {
				$organisation->organisation_name=$_POST['name'];
				if ($organisation->save()) {
					echo "1";
				}
				else{
					echo "Organizasyon güncellenemedi!";
				}
			}else{
				echo "Organizasyon Bulunamadı!";
			}
		}else{
			echo "ID Bulunamadı!";
		}
	}


	public function actionResetPassword(){
		$id=$_POST['id'];
		$user=User::model()->findByPk($id);
		if (!empty($user)) {
			$meta=new UserMeta;
			$meta->user_id=$user->id;
			$meta->meta_key='passwordReset';

			$resetId=functions::new_id(20);

			$link=Yii::app()->getBaseUrl(true);
			$link.='/user/forgetPassword?id=';
			$meta->meta_value=$resetId;
	        $meta->created=time();
        	$meta->save();

			$link .= $resetId;

        	$mail=new Email;
			$mail->setTo(array($user->email));
			$mail->setSubject('OKUTUS Şifre Sıfırlama');
			$mail->setFile('4password_reset.tr_TR.html');
			$mail->setAttributes(array('adsoyad'=>$user->name.' '.$user->surname,'title'=>'OKUTUS Şifre Sıfırlama','link'=>$link));
	        if($mail->sendMail()) {
	        	echo "1";
        	}
        	else
        	{
        		echo "Eposta gönderilemedi! Lütfen tekrar deneyiniz.";
        	}
		}
		else
		{
			echo "Kullanıcı Bulunamadı! Lütfen tekrar deneyiniz.";
		}
	}

	public function actionOrganisation($filter=""){
		$this->render('organisation');
		
		$condition="";
	 	//$filter=$_POST['filter'];
		 if ($filter) {
		 	$condition="organisation_name LIKE '%".$filter."%'";
		 }

		$dataProvider=new CActiveDataProvider('Organisations', array(
		    'criteria'=>array(
		    	'condition'=>$condition,
		    ),
		    'sort'=>array('defaultOrder'=>'LOWER(organisation_name)','attributes'=>array(
		    		'organisation_name'=>array(
		    			"asc"=>"LOWER(organisation_name)",
		    			"desc"=>"LOWER(organisation_name) DESC",
		    		),
		    	)

		    ),
		    'countCriteria'=>array(
		        // 'order' and 'with' clauses have no meaning for the count query
		    ),
		    'pagination'=>array(
		        'pageSize'=>10,
		    ),
		));
		 $dataProvider->getData(); //will return a list of Post objects

		$this->widget('zii.widgets.grid.CGridView', array(
		    'dataProvider'=>$dataProvider,
		    'columns'=>array(
		        'organisation_id',
		    	array(
		    		"name"=>"organisation_name",
  					'htmlOptions' => array('class' => 'col-md-6'),
	    		),
		        array( 
		            'class'=>'CButtonColumn',
		            'template'=>'{users}{workspaces}{categories}{hosts}{acl}{published}{guncelle}{sil}',
				    'buttons'=>array(
				        'guncelle' => array(
				            'label'=>'Düzenle',
				            'url'=>'"#"',
				            //'visible'=>'$data->score > 0',
				            'options'=>array("class"=>'btn btn-info update','title'=>'Düzenle'),
				        ),
				        'sil' => array(
				            'label'=>'Sil',
				            'url'=>'"#"',
				            //'visible'=>'$data->score > 0',
				            //'options'=>array("onclick"=>'openUpdateModal(100)'),
				            'options'=>array("class"=>'btn btn-info delete','title'=>'Sil'),
				        ),
				        'users'=>array(
				        	'label'=>"Kullanıcılar",
				        	'url'=>'"/organisations/users?organisationId=$data->organisation_id"',
				        	'options'=>array("class"=>"btn btn-info","title"=>"Kullanıcılar"),
			        	),
			        	'workspaces'=>array(
				        	'label'=>"Çalışma Alanları",
				        	'url'=>'"/organisations/workspaces?organizationId=$data->organisation_id"',
				        	'options'=>array("class"=>"btn btn-info","title"=>"Çalışma Alanları"),
			        	),

			        	'categories'=>array(
				        	'label'=>"Yayın Kategorileri",
				        	'url'=>'"/organisations/bookCategories/$data->organisation_id"',
				        	'options'=>array("class"=>"btn btn-info","title"=>"Yayın Kategorileri"),
			        	),
			        	'hosts'=>array(
				        	'label'=>"Sunucular",
				        	'url'=>'"/organisationHostings/index?organizationId=$data->organisation_id"',
				        	'options'=>array("class"=>"btn btn-info","title"=>"Sunucular"),
			        	),
			        	'acl'=>array(
				        	'label'=>"ACL",
				        	'url'=>'"/organisations/aCL/$data->organisation_id"',
				        	'options'=>array("class"=>"btn btn-info","title"=>"ACL"),
			        	),
			        	'published'=>array(
				        	'label'=>"Yayınlanan Eserler",
				        	'url'=>'"/organisations/publishedBooks/$data->organisation_id"',
				        	'options'=>array("class"=>"btn btn-info","title"=>"Yayınlanan Eserler"),
			        	),
				    ),
		        ),
		    ),
		));
	}

	public function actionBooks($filter=""){
		$this->render('books');

		$condition="";

		 if ($filter) {
		 	$condition="title LIKE '%".$filter."%'";
		 }

		$dataProvider=new CActiveDataProvider('Book', array(
		    'criteria'=>array(
		    	'condition'=>$condition,
		    ),
		    'sort'=>array('defaultOrder'=>'LOWER(title)','attributes'=>array(
		    		'title'=>array(
		    			"asc"=>"LOWER(name)",
		    			"desc"=>"LOWER(name) DESC",
		    		),
		    	)

		    ),
		    'countCriteria'=>array(
		        // 'order' and 'with' clauses have no meaning for the count query
		    ),
		    'pagination'=>array(
		        'pageSize'=>20,
		    ),
		));
		 $dataProvider->getData(); //will return a list of Post objects

		$this->widget('zii.widgets.grid.CGridView', array(
		    'dataProvider'=>$dataProvider,
		    'columns'=>array(
		    	'book_id',
		    	'author',
		    	'title',
      			//'htmlOptions' => array('class' => 'datatable table table-striped table-bordered table-hover dataTable'),
		        array( 
		            'class'=>'CButtonColumn',
		            'template'=>'{download}{usersBook}{updateBook}{removeBook}{removefrompublished}',
				    'buttons'=>array(
				        'download' => array(
				            'label'=>'Epub İndir',
				            'url'=>'"/editorActions/exportBook?bookId=$data->book_id"',
				            'options'=>array("class"=>'btn btn-info download','title'=>'Epub İndir',""),
				        ),
				        'usersBook' => array(
				            'label'=>'Kullanıcılar',
				            'url'=>'"#"',
				            'options'=>array("class"=>'btn btn-info usersBook','title'=>'Kullanıcılar',""),
				        ),
				        'updateBook' => array(
				            'label'=>'Güncelle',
				            'url'=>'"#"',
				            'options'=>array("class"=>'btn btn-info updateBook','title'=>'Güncelle',""),
				        ),
				        'removeBook' => array(
				            'label'=>'Sil',
				            'url'=>'"#"',
				            'options'=>array("class"=>'btn btn-info removeBook','title'=>'Sil',""),
				        ),
				        'removefrompublished' => array(
				            'label'=>'Yayından Kaldır',
				            //'imageUrl'=>Yii::app()->request->baseUrl.'/images/email.png',
				            // 'url'=>'Yii::app()->createUrl("users/email", array("id"=>$data->id))',
				            'url'=>'"#"',
				            'visible'=>'($data->publish_time > 0)?true:false',
				            'options'=>array("class"=>'btn btn-info removefrompublished','title'=>'Yayından Kaldır',""),
				        ),
				    ),
		        ),
		    ),
		));

	}

	//eski organisations action. view duruyor silinmedi
	public function actionOrganisations(){
		$page =(int) (isset($_GET['page']) ? $_GET['page'] : 1);  // define the variable to “LIMIT” the query
        

        $query1 = Yii::app()->db->createCommand() //this query contains all the data
        ->select(array('*'))
        ->from(array('organisations'))
        ->order('organisation_id')
        ->limit(Yii::app()->params['listPerPage'], ($page-1)*Yii::app()->params['listPerPage'] ) // the trick is here!
        ->queryAll();
        
        $item_count = Yii::app()->db->createCommand() // this query get the total number of items,
        ->select('count(*) as count')
        ->from(array('organisations'))
        ->queryAll(); // do not LIMIT it, this must count all items!

// the pagination itself
        $pages = new CPagination($item_count[0]['count']);
        $pages->setPageSize(Yii::app()->params['listPerPage']);
        

// render
        $this->render('organisations',array(
            'query1'=>$query1,
            'item_count'=>(int)$item_count[0]['count'],
            'page_size'=>Yii::app()->params['listPerPage'],
            'pages'=>$pages,
                ));
		

	}

	public function workspaceUsers($workspace_id)
	{
		$workspaceUsers = Yii::app()->db->createCommand()
		->select ("*")
		->from("workspaces_users")
		->where("workspace_id=:workspace_id", array(':workspace_id' => $workspace_id))
		->join("user","userid=id")
		->queryAll();

		return $workspaceUsers;
	}

	public function actionGetAllUsers(){
		$users=Yii::app()->db->createCommand()
		->select ("id,name,surname")
		->from("user")
		->where('id!=0')
		->queryAll();

		echo json_encode($users);
	}

	public function getTemplateWorkspaces()
	{
		$workspace = Yii::app()->db->createCommand()
		->select ("*")
		->from("organisations_meta")
		->where("meta=:meta", array(':meta' => 'template'))
		->queryAll();

		return $workspace;
	}

	public function actionGetBookUsers($id)
	{
		$bookUsers = Yii::app()->db->createCommand()
		->select ("*")
		->from("book_users")
		->where("book_id=:book_id", array(':book_id' => $id))
		->join("user","user_id=id")
		->queryAll();

		echo json_encode($bookUsers);
	}

	/**
	 * getUserWorkspaces
	 * @return array user workspaces
	 */
	public function getUserWorkspaces()
	{
		$userid=Yii::app()->user->id;
		$templates=$this->getTemplateWorkspaces();

		$workspacesOfUser= Yii::app()->db->createCommand()
	    ->select("*")
	    ->from("workspaces_users x")
	    ->join("user u","x.userid=u.id")
	    ->join("workspaces w",'w.workspace_id=x.workspace_id')
	    //->where("userid=:id", array(':id' => $userid ) )
	    ->queryAll();
	    
	    foreach ($templates as $key => $template) {
	    	foreach ($workspacesOfUser as $key => $workspace) {
		    	if ($template['value']===$workspace['workspace_id']) {
		    		unset($workspacesOfUser[$key]);
		    	}
	    	}
	    }

	    return $workspacesOfUser;	
	}

	public function getWorkspaceBooks($workspace_id)
	{
		$resize=true;

		$all_books= Book::model()->findAll('workspace_id=:workspace_id AND (publish_time IS NULL OR publish_time=0)', 
	    				array(':workspace_id' => $workspace_id) );
		if ($resize)
			foreach ($all_books as $key => $book) {
				$bookData=json_decode($book->data,true);
				if(strlen($bookData['thumbnail'])> 120000){
					$bookData['thumbnail']=functions::compressBase64Image( $bookData['thumbnail'] ,74000, 74000,100);
					$book->data=json_encode($bookData);
					$book->save();
				}
			}
		return $all_books; 
	}

}