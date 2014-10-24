<?php
class LepubForm extends CFormModel
{
    public $workspace;
    public $lepub_file;
    public function rules()
    {
        return array(
            array('workspace', 'checkworkspace'),
            array('lepub_file', 'checklepub'),
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
}
