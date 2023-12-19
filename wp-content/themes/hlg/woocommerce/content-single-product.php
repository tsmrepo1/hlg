<?php 
/**
 * The template for displaying product content in the single-product.php template
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/content-single-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 3.6.0
 */

defined( 'ABSPATH' ) || exit;

global $product;

/**
 * Hook: woocommerce_before_single_product.
 *
 * @hooked woocommerce_output_all_notices - 10
 */
do_action( 'woocommerce_before_single_product' );

if ( post_password_required() ) {
	echo get_the_password_form(); // WPCS: XSS ok.
	return;
}

$mrp = get_post_meta( get_the_ID(), '_regular_price', true);
$seling_price = get_post_meta( get_the_ID(), '_sale_price', true);

if(!empty($mrp) && !empty($seling_price)){ 
    $dsp = (int)((($mrp - $seling_price) / $mrp) * 100);
}else{
    $dsp ='';
}
?>

<!-- SITE CONTENT -->
<main class="site-content site-content--product-single">
<section class="pagetitle-section">
<div class="pagetitle-section__bottom bg-primary">
  <div class="container">
    <nav class="w-full breadcrumb text-center">
      <ol class="list-reset inline-flex py-4 border-b border-b-borderColor">
        <li><a href="<?php echo home_url(); ?>">Home</a></li>
        <li><span class="mx-2">-</span></li>
        <li><a href="<?php echo site_url('/shop'); ?>">Products</a></li>
        <li><span class="mx-2">-</span></li>
        <li><?php the_title(); ?></li>
      </ol>
    </nav>
  </div>
</div>
</section>

<section class="product-single-section section--py">
<div class="container">
  <div class="grid grid-cols-12 gap-y-7 md:gap-x-8">
    <div class="col-span-12 md:col-span-6">
        <div id="productSingleSlider" class="slider-pro">
            <div class="sp-slides">
	        <?php 
	        $attachment_ids = $product->get_gallery_image_ids();
	        if ( $attachment_ids && $product->get_image_id() ) {
	        foreach ( $attachment_ids as $attachment_id ) {
	        $image_link = wp_get_attachment_url( $attachment_id );
	        ?>
	          <div class="sp-slide"> <img class="sp-image" src="<?php echo $image_link; ?>"> </div>
	        <?php } }?> 
	        </div>

	        <div class="sp-thumbnails">
	        <?php 
	        $attachment_ids = $product->get_gallery_image_ids();
	        if ( $attachment_ids && $product->get_image_id() ) {
	        foreach ( $attachment_ids as $attachment_id ) {
	        $image_link = wp_get_attachment_url( $attachment_id );
	        ?>
	          	<img class="sp-thumbnail rounded-2xl" src="<?php echo $image_link; ?>">
	        <?php } }?>
	        </div>
          </div>
    </div>
    <div class="col-span-12 md:col-span-6">
      <h3 class="product-single__title uppercase text-dark font-heading text-2xl md:text-3xl xl:text-4xl mb-5">
      	<?php the_title(); ?>      		
      </h3>
      <div class="product-single__pricing flex items-center mb-5 pb-3">
        <div class="pr-5 border-r border-r-borderColor">
          <?php if($seling_price!=''){ ?>
          <h4 class="product-single__sale-price text-xl lg:text-2xl text-primary font-bold">$<?php echo $seling_price; ?>.00</h4>
          <h5 class="product-single__regular-price text-lg lg:text-xl line-through text-stone-600 font-bold">$<?php echo $mrp; ?>.00</h5>
          <?php  }else{ ?>
          	<h4 class="product-single__sale-price text-xl lg:text-2xl text-primary font-bold">$<?php echo $mrp; ?>.00</h4>
          <?php } ?>
        </div>
        <div class="pl-5">
          <h4 class="text-xl lg:text-2xl font-bold text-accent"><?php echo $dsp; ?>% Off</h4>
        </div>
      </div>
      <?php if( get_field('highlights_content') ){ ?>
      <div class="product-single__highlights mb-8">
        <h6 class="text-dark font-bold uppercase mb-3">Highlights</h6>
        <?php echo get_field('highlights_content'); ?>
      </div>
      <?php } ?>


      <div class="product-single__cta-container flex items-center mb-5">

        <?php if ( ! $product->is_in_stock() ) : ?>

		<a href="<?php echo apply_filters( 'out_of_stock_add_to_cart_url', get_permalink( $product->id ) ); ?>" class="product-single__btn--cart btn btn-primary mx-4"><?php echo apply_filters( 'out_of_stock_add_to_cart_text', __( 'Read More', 'woocommerce' ) ); ?></a>

		<?php else : ?>

		<?php
		$link = array(
		'url'   => '',
		'label' => '',
		'class' => ''
		);

		switch ( $product->product_type ) {
		case "variable" :
		    $link['url']    = apply_filters( 'variable_add_to_cart_url', get_permalink( $product->id ) );
		    $link['label']  = apply_filters( 'variable_add_to_cart_text', __( 'Select options', 'woocommerce' ) );
		break;
		case "grouped" :
		    $link['url']    = apply_filters( 'grouped_add_to_cart_url', get_permalink( $product->id ) );
		    $link['label']  = apply_filters( 'grouped_add_to_cart_text', __( 'View options', 'woocommerce' ) );
		break;
		case "external" :
		    $link['url']    = apply_filters( 'external_add_to_cart_url', get_permalink( $product->id ) );
		    $link['label']  = apply_filters( 'external_add_to_cart_text', __( 'Read More', 'woocommerce' ) );
		break;
		default :
		    if ( $product->is_purchasable() ) {
		        $link['url']    = apply_filters( 'add_to_cart_url', esc_url( $product->add_to_cart_url() ) );
		        $link['label']  = apply_filters( 'add_to_cart_text', __( 'Add to cart', 'woocommerce' ) );
		        $link['class']  = apply_filters( 'add_to_cart_class', 'Add To Cart' );
		    } else {
		        $link['url']    = apply_filters( 'not_purchasable_url', get_permalink( $product->id ) );
		        $link['label']  = apply_filters( 'not_purchasable_text', __( 'Read More', 'woocommerce' ) );
		    }
		break;
		}

		// If there is a simple product.
		if ( $product->product_type == 'simple' ) {
		?>
		<form action="<?php echo esc_url( $product->add_to_cart_url() ); ?>" class="cart" method="post" enctype="multipart/form-data">
		    <?php
		        // Displays the quantity box.
		        woocommerce_quantity_input();

		        // Display the submit button.
		        echo sprintf( '<button type="submit" data-product_id="%s" data-product_sku="%s" data-quantity="1" class="product-single__btn--cart btn btn-primary mx-4">%s</button>', esc_attr( $product->id ), esc_attr( $product->get_sku() ), esc_attr( $link['class'] ), esc_html( $link['label'] ) );
		    ?>
		</form>
		<?php
		} else {
		echo apply_filters( 'woocommerce_loop_add_to_cart_link', sprintf('<a href="%s" rel="nofollow" data-product_id="%s" data-product_sku="%s" class="product-single__btn--cart btn btn-primary mx-4">%s</a>', esc_url( $link['url'] ), esc_attr( $product->id ), esc_attr( $product->get_sku() ), esc_attr( $link['class'] ), esc_attr( $product->product_type ), esc_html( $link['label'] ) ), $product, $link );
		}
		endif; 
		?>        
        <?php echo do_shortcode("[ti_wishlists_addtowishlist loop=no]");?>
      </div> 
		<?php 
		$short_description = apply_filters( 'woocommerce_short_description', $post->post_excerpt );
		if(!empty($short_description)){
		?>

		<div class="product-single__short-desc py-5 border-t border-b border-borderColor">
		<p class="text-para"><?php echo $short_description ?></p>
		</div>
		<?php } ?>

      <div class="product-single__meta-info pt-5 xl:pr-14 2xl:pr-20">
        <div class="grid grid-cols-12 gap-x-3 items-center">

		<?php if( get_field('free_shipping') == 'Yes' ){ ?>
		<div class="col-span-3 border-r border-r-borderColor">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="w-7"><path d="M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM208 416c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zm272 48c-26.5 0-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48z" class="fill-primary" /></svg>
		<p class="text-dark text-xs mt-2 font-semibold uppercase">Free<br />Shipping</p>
		</div>
		<?php } ?>
		<?php if( get_field('cash_on_delivery') == 'Yes' ){ ?>
		<div class="col-span-3 border-r border-r-borderColor">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="w-7"><path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm64 320H64V320c35.3 0 64 28.7 64 64zM64 192V128h64c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64v64H448zm64-192c-35.3 0-64-28.7-64-64h64v64zM288 352c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96z" class="fill-primary"/></svg>  
		<p class="text-dark text-xs mt-2 font-semibold uppercase">Cash on<br />Delivery</p>
		</div>
		<?php } ?>
		<?php if( get_field('easy_returns') == 'Yes' ){ ?>
		<div class="col-span-3 border-r border-r-borderColor">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-7"><path d="M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z" class="fill-primary"/></svg> 
		<p class="text-dark text-xs mt-2 font-semibold uppercase">Easy<br />Returns</p>
		</div>
		<?php } ?>

          <div class="col-span-3">
            <p class="text-dark text-xs mb-2 font-semibold uppercase">Share:</p>
            <ul class="product-single__share-list flex items-center">
              <?php if( get_field('facebook_social_sharing') ){ ?>
	              <li class="mr-2.5 last:mr-0">
	                <a href="<?php echo get_field('facebook_social_sharing'); ?>" title="Share on facebook">
	                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="w-3"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" class="fill-primary"/></svg>
	                </a>
	              </li>
	            <?php } ?>
	            <?php if( get_field('twitter_social_sharing') ){ ?>
	              <li class="mr-2.5 last:mr-0">
	                <a href="<?php echo get_field('facebook_social_sharing'); ?>" title="Share on twitter">
	                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" class="fill-primary"/></svg>
	                </a>
	              </li>
	            <?php } ?>
	            <?php if( get_field('whatsapp_social_sharing') ){ ?>
					<li class="mr-2.5 last:mr-0">
					<a href="<?php echo get_field('whatsapp_social_sharing'); ?>" title="Share on whatsapp">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-5"><path d="M224 122.8c-72.7 0-131.8 59.1-131.9 131.8 0 24.9 7 49.2 20.2 70.1l3.1 5-13.3 48.6 49.9-13.1 4.8 2.9c20.2 12 43.4 18.4 67.1 18.4h.1c72.6 0 133.3-59.1 133.3-131.8 0-35.2-15.2-68.3-40.1-93.2-25-25-58-38.7-93.2-38.7zm77.5 188.4c-3.3 9.3-19.1 17.7-26.7 18.8-12.6 1.9-22.4.9-47.5-9.9-39.7-17.2-65.7-57.2-67.7-59.8-2-2.6-16.2-21.5-16.2-41s10.2-29.1 13.9-33.1c3.6-4 7.9-5 10.6-5 2.6 0 5.3 0 7.6.1 2.4.1 5.7-.9 8.9 6.8 3.3 7.9 11.2 27.4 12.2 29.4s1.7 4.3.3 6.9c-7.6 15.2-15.7 14.6-11.6 21.6 15.3 26.3 30.6 35.4 53.9 47.1 4 2 6.3 1.7 8.6-1 2.3-2.6 9.9-11.6 12.5-15.5 2.6-4 5.3-3.3 8.9-2 3.6 1.3 23.1 10.9 27.1 12.9s6.6 3 7.6 4.6c.9 1.9.9 9.9-2.4 19.1zM400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM223.9 413.2c-26.6 0-52.7-6.7-75.8-19.3L64 416l22.5-82.2c-13.9-24-21.2-51.3-21.2-79.3C65.4 167.1 136.5 96 223.9 96c42.4 0 82.2 16.5 112.2 46.5 29.9 30 47.9 69.8 47.9 112.2 0 87.4-72.7 158.5-160.1 158.5z" class="fill-primary"/></svg> </a>
					</li>
	             <?php } ?>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</section>
<!-- ADDITIONAL DESCRIPTION -->
<section>
<div class="bg-primary">
  <div class="container">
    <ul class="nav nav-tabs border-b-0 pl-0 product-single__description-tab" id="tabs-tab" role="tablist">
      <li class="nav-item" role="presentation">
        <a href="#tabs-home" class="nav-link px-6 py-3 md:text-lg lg:text-xl 2xl:text-2xl font-semibold active" id="tabs-description-tab" data-bs-toggle="pill" data-bs-target="#tabs-description" role="tab" aria-controls="tabs-description" aria-selected="true">Description</a>
      </li>
      <?php if(!empty(get_field('specification_content'))){ ?>
      <li class="nav-item" role="presentation">
        <a href="#tabs-profile" class="nav-link px-6 py-3 md:text-lg lg:text-xl 2xl:text-2xl font-semibold" id="tabs-specification-tab" data-bs-toggle="pill" data-bs-target="#tabs-specification" role="tab" aria-controls="tabs-specification" aria-selected="false">Specification</a>
      </li>
      <?php } ?>
    </ul>
  </div>
</div>
<div class="bg-light py-12 lg:py-14 xl:py-16 2xl:py-[5.5rem]">
  <div class="container">
    <div class="tab-content pt-5" id="tabs-tabContent">
      <div class="tab-pane fade show active" id="tabs-description" role="tabpanel" aria-labelledby="tabs-description-tab">
        <div class="content-box content-box--text-dark font-medium">
          <?php the_content(); ?>
        </div>
      </div>
      <div class="tab-pane fade" id="tabs-specification" role="tabpanel" aria-labelledby="tabs-specification-tab">
        <div class="content-box content-box--text-dark font-medium">
          <?php echo get_field('specification_content'); ?>
        </div>
      </div>
    </div>
  </div>
</div>
</section>

<!-- RELATED PRODUCTS SECTION -->
<section class="products-section related-products-section section--py lg:-mt-20 xl:mt-0">
<div class="container">
  <h2
    class="section__heading text-center text-primary font-heading uppercase mb-10 lg:mb-14 xl:mb-20 2xl:mb-[6.25rem]">
    Related Products</h2>

  <div class="swiper swiper--products px-lg-3 pb-4">
    <div class="swiper-wrapper pb-16">
      <!-- Slides -->

	<?php
	$args = array(
	'post_type' => 'product',
	'meta_query'=> array(
	    array(
	    'key' => 'related_products',
	    'value' => 'Yes'
	    )
	),
	'posts_per_page' => 8
	);
	$loop = new WP_Query( $args );
	//echo "<pre>";
	//print_r($loop);
	if ( $loop->have_posts() ) {
	 while ( $loop->have_posts() ) : $loop->the_post();
	  $thumb = wp_get_attachment_image_src( get_post_thumbnail_id($loop->ID), 'full' );
	 $mrp = get_post_meta( get_the_ID(), '_regular_price', true);
	 $seling_price = get_post_meta( get_the_ID(), '_sale_price', true);

	    if(!empty($mrp) && !empty($seling_price)){ 
	        $dsp = (int)((($mrp - $seling_price) / $mrp) * 100);
	    }else{
	        $dsp ='';
	    }

	?>

      <div class="swiper-slide">
        <div class="product-card relative">
          <div class="product-card__title mb-4">
            <a href="<?php the_permalink(); ?>" class="text-dark hover:text-primary font-bold text-sm lg:text-base xl:text-lg line-clamp line-clamp--1" title="<?php the_title(); ?>"><?php echo wp_trim_words( get_the_title(), 13, '...' ); ?></a>
          </div>
          <div
            class="product-card__header border border-borderColor rounded-3xl relative aspect-square group overflow-hidden">

            <div class="swiper product-card-swiper h-full">
              <div class="swiper-wrapper">
               
                <div class="swiper-slide">
                  <figure class="product-card__thumbnail overflow-hidden aspect-square">
					<a href="<?php the_permalink(); ?>">
					<?php if($thumb != ''){ ?>
					<img src="<?php echo $thumb['0']; ?>" alt="<?php the_title(); ?>" class="w-full h-full object-cover group-hover:scale-110 ppc">
					<?php } else{ ?>
					<img src="<?php bloginfo('template_directory'); ?>/assets/images/dcb02740e1aa9d2cd9647a41a4acc8e4.jpg" alt="" class="w-full h-full object-cover group-hover:scale-110 ppc">
					<?php } ?>
                    </a>
                  </figure>
                </div>
              </div>
              <!-- If we need pagination -->
              <div class="swiper-pagination"></div>

            </div>
            <span class="product-card__discount-badge text-xs text-white bg-primary px-2 py-1 rounded-md font-medium"><?php echo $dsp; ?>% OFF</span>
          </div>
          <div class="product-card__body pt-4">
            <div class="grid grid-cols-12 gap-3 items-center">
              <div class="product-card__price flex items-center col-span-12 lg:col-span-6">
				<?php if($seling_price!=''){ ?>
				<span class="product-card__sale-price font-medium text-secondary text-base lg:text-lg xl:text-xl 2xl:text-2xl">$<?php echo $seling_price; ?>.00</span>
				<span class="product-card__regular-price font-medium line-through text-stone-500 ml-2 xl:ml-3 2xl:text-lg">$<?php echo $mrp; ?>.00</span>

				<?php  }else{ ?>
				<span class="product-card__sale-price font-medium text-secondary text-base lg:text-lg xl:text-xl 2xl:text-2xl">$<?php echo $mrp; ?>.00</span>
				<?php } ?>

              </div>

              <div class="product-card__cta-container col-span-12 lg:col-span-6  flex items-center lg:justify-end">
              	<?php echo '<a href="?add-to-cart='.get_the_id($product).'" title="Add to cart" class="product-card__btn--cart bg-primary mr-3">'; ?>
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px"
                    height="20px">
                    <path fill-rule="evenodd" fill="rgb(255, 255, 255)"
                      d="M0.632,19.594 C0.402,19.359 0.288,19.081 0.288,18.760 L0.288,5.721 C0.288,5.400 0.402,5.122 0.632,4.887 C0.861,4.653 1.133,4.535 1.447,4.535 L3.765,4.535 C3.789,3.548 4.139,2.708 4.815,2.016 C5.491,1.325 6.300,0.979 7.242,0.979 C8.184,0.979 8.993,1.325 9.669,2.016 C10.345,2.708 10.695,3.548 10.719,4.535 L13.037,4.535 C13.351,4.535 13.623,4.653 13.852,4.887 C14.082,5.122 14.197,5.400 14.197,5.721 L14.197,18.760 C14.197,19.081 14.082,19.359 13.852,19.594 C13.623,19.828 13.351,19.946 13.037,19.946 L1.447,19.946 C1.133,19.946 0.861,19.828 0.632,19.594 ZM1.447,5.721 L1.447,18.760 L13.037,18.760 L13.037,5.721 L1.447,5.721 ZM4.924,4.535 L9.560,4.535 C9.536,3.869 9.301,3.307 8.854,2.850 C8.407,2.393 7.870,2.165 7.242,2.165 C6.614,2.165 6.077,2.393 5.630,2.850 C5.183,3.307 4.948,3.869 4.924,4.535 L4.924,4.535 ZM5.087,7.925 C4.978,7.814 4.924,7.672 4.924,7.499 C4.924,7.326 4.978,7.184 5.087,7.073 C5.196,6.962 5.334,6.906 5.503,6.906 L8.981,6.906 C9.149,6.906 9.289,6.962 9.397,7.073 C9.506,7.184 9.560,7.326 9.560,7.499 C9.560,7.672 9.506,7.814 9.397,7.925 C9.289,8.036 9.149,8.092 8.981,8.092 L5.503,8.092 C5.334,8.092 5.196,8.036 5.087,7.925 Z" />
                  </svg>
                </a>
                <?php echo do_shortcode("[ti_wishlists_addtowishlist loop=no]");?>
              </div>
            </div>
          </div>
        </div>
      </div>
	<?php                                       
	endwhile;
	} else {
	    echo __( 'No products found' );
	}
	wp_reset_postdata();
	?>      
    </div>
    <div class="swiper-pagination"></div>
  </div>
</div>
</section>
</main>
