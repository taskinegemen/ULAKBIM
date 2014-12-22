<?php

/**
 * This is the model class for table "page".
 *
 * The followings are the available columns in table 'page':
 * @property string $page_id
 * @property string $created
 * @property string $chapter_id
 * @property string $data
 * @property integer $order
 * @property string $pdf_data
 *
 * The followings are the available model relations:
 * @property Component[] $components
 * @property Chapter $chapter
 */
class Page extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'page';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('page_id, chapter_id', 'required'),
			array('order', 'numerical', 'integerOnly'=>true),
			array('page_id, chapter_id', 'length', 'max'=>44),
			array('created, data', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('page_id, created, chapter_id, data, order, pdf_data', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
			'components' => array(self::HAS_MANY, 'Component', 'page_id'),
			'chapter' => array(self::BELONGS_TO, 'Chapter', 'chapter_id'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'page_id' => 'Page',
			'created' => 'Created',
			'chapter_id' => 'Chapter',
			'data' => 'Data',
			'order' => 'Order',
			'pdf_data' => 'Pdf Data',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('page_id',$this->page_id,true);
		$criteria->compare('created',$this->created,true);
		$criteria->compare('chapter_id',$this->chapter_id,true);
		$criteria->compare('data',$this->data,true);
		$criteria->compare('order',$this->order);
		$criteria->compare('pdf_data',$this->pdf_data,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Page the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
