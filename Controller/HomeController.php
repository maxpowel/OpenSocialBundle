<?php

namespace Wixet\OpenSocialBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

// these import the "@Route" and "@Template" annotations
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class HomeController extends Controller
{
    /**
     * @Route("/", name="_index")
     * @Template()
     */
    public function indexAction()
    {
        return $this->forward('OpenSocialBundle:Section:start');
    }
    
     
    /* Sections */
    
    /**
     * @Route("/start", name="_start")
     * @Template()
     */
    public function startAction()
    {	
		echo "hola";
        return array();
    } 
    
    
    /**
     * @Route("/profile/{id}", name="_start")
     * @Template()
     */
    public function profileAction($id)
    {
        return array();
    }
     

}
