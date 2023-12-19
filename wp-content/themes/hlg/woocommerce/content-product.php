<?php
/**
 * The template for displaying product content within loops
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/content-product.php.
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

// Ensure visibility.
if ( empty( $product ) || ! $product->is_visible() ) {
	return;
}
global $product;

// Ensure visibility.
if ( empty( $product ) || ! $product->is_visible() ) {
	return;
}
$thumb = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'full' );
$mrp = get_post_meta( get_the_ID(), '_regular_price', true);
$seling_price = get_post_meta( get_the_ID(), '_sale_price', true);

if(!empty($mrp) && !empty($seling_price)){ 
    $dsp = (int)((($mrp - $seling_price) / $mrp) * 100);
}else{
    $dsp ='';
}
?>
<div class="col-span-6 md:col-span-4 lg:col-span-6 xl:col-span-4">
<div class="product-card relative">
  <div class="product-card__title mb-4">
    <a href="<?php the_permalink(); ?>"
      class="text-dark hover:text-primary font-bold text-sm lg:text-base xl:text-lg line-clamp line-clamp--1"
      title="400W Power House Gen. + One (1) 50W Panel"><?php echo wp_trim_words( get_the_title(), 13, '...' ); ?></a>
  </div>
  <div class="product-card__header border border-borderColor rounded-3xl relative aspect-square group overflow-hidden">

    <div class="swiper product-card-swiper h-full">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <figure class="product-card__thumbnail overflow-hidden aspect-square">
            <a href="<?php the_permalink(); ?>">
				<?php if($thumb != ''){ ?>
				<img src="<?php echo $thumb['0']; ?>" alt="<?php the_title(); ?>" class="w-full h-full object-cover">
				<?php } else{ ?>
				<img src="<?php bloginfo('template_directory'); ?>/assets/images/dcb02740e1aa9d2cd9647a41a4acc8e4.jpg" alt="" class="w-full h-full object-cover">
				<?php } ?>
            </a>
          </figure>
        </div>
        <div class="swiper-slide">
          <figure class="product-card__thumbnail overflow-hidden aspect-square">
            <a href="<?php the_permalink(); ?>">
			<?php if($thumb != ''){ ?>
			<img src="<?php echo $thumb['0']; ?>" alt="<?php the_title(); ?>" class="w-full h-full object-cover">
			<?php } else{ ?>
			<img src="<?php bloginfo('template_directory'); ?>/assets/images/dcb02740e1aa9d2cd9647a41a4acc8e4.jpg" alt="" class="w-full h-full object-cover">
			<?php } ?>
            </a>
          </figure>
        </div>
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>
    </div>
	<?php if(!empty($dsp)) { ?>
	<span class="product-card__discount-badge text-xs text-white bg-primary px-2 py-1 rounded-md font-medium"><?php echo $dsp; ?>% OFF</span>
	<?php } ?>
  </div>
  <div class="product-card__body pt-4">
    <div class="grid grid-cols-12 gap-3 items-center">
      <div class="product-card__price flex items-center col-span-12 lg:col-span-6">  
		<?php if($seling_price!=''){ ?>
		<span class="product-card__sale-price font-bold text-secondary text-base lg:text-lg xl:text-xl 2xl:text-2xl">$<?php echo $seling_price; ?>.00</span>
		<span class="product-card__regular-price font-semibold line-through text-stone-500 ml-2 xl:ml-3 2xl:text-lg">$<?php echo $mrp; ?>.00</span>

		<?php  }else{ ?>
		<span class="product-card__sale-price font-bold text-secondary text-base lg:text-lg xl:text-xl 2xl:text-2xl">$<?php echo $mrp; ?>.00</span>
		<?php } ?>
      </div>
      <div class="product-card__cta-container col-span-12 lg:col-span-6  flex items-center lg:justify-end">
      	<?php echo '<a href="?add-to-cart='.get_the_id($product).'" title="Add to cart" class="product-card__btn--cart bg-primary mr-3">'; ?>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            width="15px" height="20px">
            <path fill-rule="evenodd" fill="rgb(255, 255, 255)"
              d="M0.632,19.594 C0.402,19.359 0.288,19.081 0.288,18.760 L0.288,5.721 C0.288,5.400 0.402,5.122 0.632,4.887 C0.861,4.653 1.133,4.535 1.447,4.535 L3.765,4.535 C3.789,3.548 4.139,2.708 4.815,2.016 C5.491,1.325 6.300,0.979 7.242,0.979 C8.184,0.979 8.993,1.325 9.669,2.016 C10.345,2.708 10.695,3.548 10.719,4.535 L13.037,4.535 C13.351,4.535 13.623,4.653 13.852,4.887 C14.082,5.122 14.197,5.400 14.197,5.721 L14.197,18.760 C14.197,19.081 14.082,19.359 13.852,19.594 C13.623,19.828 13.351,19.946 13.037,19.946 L1.447,19.946 C1.133,19.946 0.861,19.828 0.632,19.594 ZM1.447,5.721 L1.447,18.760 L13.037,18.760 L13.037,5.721 L1.447,5.721 ZM4.924,4.535 L9.560,4.535 C9.536,3.869 9.301,3.307 8.854,2.850 C8.407,2.393 7.870,2.165 7.242,2.165 C6.614,2.165 6.077,2.393 5.630,2.850 C5.183,3.307 4.948,3.869 4.924,4.535 L4.924,4.535 ZM5.087,7.925 C4.978,7.814 4.924,7.672 4.924,7.499 C4.924,7.326 4.978,7.184 5.087,7.073 C5.196,6.962 5.334,6.906 5.503,6.906 L8.981,6.906 C9.149,6.906 9.289,6.962 9.397,7.073 C9.506,7.184 9.560,7.326 9.560,7.499 C9.560,7.672 9.506,7.814 9.397,7.925 C9.289,8.036 9.149,8.092 8.981,8.092 L5.503,8.092 C5.334,8.092 5.196,8.036 5.087,7.925 Z" />
          </svg>
        </a>

        <!-- <a href="#" class="product-card__btn--wishlist bg-primary" title="Add To Wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            width="29px" height="26px">
            <path fill-rule="evenodd" fill="rgb(113, 97, 208)"
              d="M29.396,8.958 L29.396,9.016 L29.396,9.075 C29.396,9.115 29.386,9.173 29.368,9.251 C29.348,9.330 29.339,9.388 29.339,9.427 C29.301,11.029 28.990,12.561 28.405,14.026 C27.819,15.491 27.121,16.761 26.309,17.835 C25.497,18.910 24.534,19.915 23.421,20.852 C22.306,21.790 21.296,22.552 20.390,23.138 C19.484,23.724 18.540,24.260 17.558,24.749 C16.576,25.237 15.916,25.540 15.576,25.657 C15.236,25.774 14.971,25.872 14.783,25.950 C14.593,25.872 14.330,25.764 13.990,25.628 C13.650,25.491 12.999,25.189 12.036,24.720 C11.073,24.251 10.147,23.724 9.260,23.138 C8.373,22.552 7.382,21.781 6.287,20.823 C5.191,19.866 4.238,18.860 3.426,17.805 C2.614,16.751 1.925,15.491 1.359,14.026 C0.793,12.561 0.490,11.029 0.453,9.427 C0.453,9.388 0.443,9.330 0.424,9.251 C0.405,9.173 0.396,9.115 0.396,9.075 L0.396,9.016 C0.396,8.978 0.396,8.939 0.396,8.899 C0.433,6.595 1.255,4.573 2.860,2.835 C4.464,1.097 6.362,0.228 8.552,0.228 C11.120,0.228 13.234,1.380 14.896,3.685 C16.557,1.380 18.672,0.228 21.240,0.228 C23.429,0.228 25.327,1.097 26.932,2.835 C28.537,4.573 29.358,6.595 29.396,8.899 L29.396,8.958 ZM27.584,9.075 C27.584,9.037 27.584,8.997 27.584,8.958 C27.546,7.083 26.904,5.472 25.658,4.124 C24.412,2.776 22.939,2.103 21.240,2.103 C19.276,2.103 17.652,3.002 16.369,4.798 C15.991,5.306 15.500,5.560 14.896,5.560 C14.292,5.560 13.800,5.306 13.423,4.798 C12.139,3.002 10.515,2.103 8.552,2.103 C6.853,2.103 5.380,2.776 4.134,4.124 C2.888,5.472 2.246,7.083 2.209,8.958 C2.209,8.997 2.209,9.037 2.209,9.075 C2.246,9.154 2.265,9.232 2.265,9.310 C2.302,11.029 2.699,12.670 3.455,14.231 C4.210,15.794 5.069,17.083 6.032,18.098 C6.995,19.115 8.118,20.072 9.402,20.970 C10.685,21.869 11.724,22.513 12.517,22.903 C13.310,23.294 14.065,23.646 14.783,23.958 C15.500,23.646 16.264,23.294 17.077,22.903 C17.888,22.513 18.946,21.869 20.249,20.970 C21.551,20.072 22.693,19.115 23.675,18.098 C24.657,17.083 25.535,15.794 26.309,14.231 C27.083,12.670 27.489,11.048 27.527,9.368 C27.527,9.251 27.546,9.154 27.584,9.075 L27.584,9.075 Z"
              class="fill-white"></path>
          </svg>
        </a> -->
        <?php echo do_shortcode("[ti_wishlists_addtowishlist loop=no]");?>
      </div>
    </div>
  </div>
</div>
</div>
