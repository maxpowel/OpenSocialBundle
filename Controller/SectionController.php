<?php

namespace Wixet\OpenSocialBundle\Controller;

use Gedmo\Translatable\Entity\AbstractTranslation;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

// these import the "@Route" and "@Template" annotations
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

//use Wixet\OpenSocialBundle\Entity\Bloguero;

class SectionController extends Controller
{
    /**
     * @Route("/", name="_index")
     */
    public function indexAction()
    {
        return $this->forward('OpenSocialBundle:Section:start');
    }
    
    /**
     * @Route("/start", name="_cosa")
     */
    public function startAction()
    {

//		$this->get('wixet.media_item_manager');
		$gadgets = array();
		$gadgets[0]=array();
		$gadgets[1]=array();
		$gadgets[2]=array();
        return $this->render('OpenSocialBundle::gadgetView.html.twig',array("left"=>$gadgets[0],"center"=>$gadgets[1],"right"=>$gadgets[2],"section"=>"start"));
    }
    
     
    /* Sections */
    
  
    //public function startAction(){
			
		/*$em = $this->get('doctrine.orm.entity_manager');
		$query = $em->createQuery('select g.gadgetUrl,gi.id,gi.gadgetColumn,gi.gadgetRow FROM Wixet\WixetBundle\Entity\GadgetInstance gi JOIN gi.section s JOIN gi.gadget g WHERE s.sectionName = ?1 AND gi.user = ?2');
		$query->setParameter(1, "start");
		$query->setParameter(2, $this->get('security.context')->getToken()->getUser());
		
		$gadgets = array(array());
		
		foreach($query->getResult() as $result){
			$gadgets[$result['gadgetColumn']][$result['gadgetRow']] = array("url"=>$result['gadgetUrl'],"id"=>$result['id']);
		}
		
		return $this->render('WixetBundle:Wixet:section.html.twig',array("left"=>$gadgets[0],"center"=>$gadgets[1],"right"=>$gadgets[2],"section"=>"start"));*
		*/ 
	//	$em = $this->get('doctrine.orm.entity_manager');
		
		
		/*$bloguero = new Bloguero();
		$em->persist($bloguero);
		$blog = new \Wixet\OpenSocialBundle\Entity\Blog();
		$em->persist($blog);
		$blog->setTitle("The guiri");
		$blog->setContent("In english");
		$bloguero->addBlog($blog);
		$em->flush();*/
		
		// first load the article
	//	$article = $em->find('\Wixet\OpenSocialBundle\Entity\Blog', 4);
		/*$article->setTitle('Aadsfaefs');
		$article->setContent('dsaf asdfe hge');
		$article->setTranslatableLocale('de_de'); // change locale
		$em->persist($article);
		$em->flush();*/
		//$article->setLocale('de_de');
		//$em->refresh($article);
		//echo $article->getTitle();
		
		
		//$repository = $em->getRepository('Gedmo\\Translatable\\Entity\\Translation');
		
	//	return array();
//	}
    
    
    /**
     * @Route("/profile/{id}", name="_start")
     * @Template()
     */
    public function profileAction($id)
    {
        return array();
    }
     

}
