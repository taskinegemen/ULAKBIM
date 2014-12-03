<?php
class LepubForm extends CFormModel
{
    public $workspace;
    public $lepub_file;
    public $lepub_type;
    public function rules()
    {
        return array(
            array('workspace', 'checkworkspace'),
            //array('lepub_file', 'checklepub'),
            array('lepub_file', 'file', 'allowEmpty'=>false, 'types'=>'epub,lepub', 'maxSize'=>400097152),//400MB
            array('lepub_type', 'checklepub_type'),
        );
    }
    public function checkworkspace($attribute,$params)
    {
    	if($this->workspace=="")
        	$this->addError('workspace','Lütfen çalışma alanı seçiniz');
    }
    public function checklepub($attribute,$params)
    {
        if($this->lepub_file=="")
        	$this->addError('lepub_file','Lütfen bir (l)epub dosyası yükleyiniz');
    }
    public function checklepub_type($attribute,$params)
    {
       
    }
}
