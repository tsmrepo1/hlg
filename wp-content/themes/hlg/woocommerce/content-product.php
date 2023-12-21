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
  <div class="product-card bg-white p-3 rounded-[0.875rem] shadow-[0_10px_9px_rgba(0,0,0,0.06)]">
    <div class="relative">
      <figure class="border border-[#f2f2f2] rounded-[0.875rem] overflow-hidden">
        <a href="<?php the_permalink(); ?>">
        <?php if($thumb != ''){ ?>
        <img src="<?php echo $thumb['0']; ?>" alt="<?php the_title(); ?>" class="w-full h-full object-cover">
        <?php } else{ ?>
        <img src="<?php bloginfo('template_directory'); ?>/assets/images/no_image.jpg" alt="" class="w-full h-full object-cover">
        <?php } ?>
        </a>
      </figure>
      <?php if($dsp!=''){ ?>
      <span class="bg-primary font-heading rounded-[3.75rem] leading-[1] text-white absolute top-3 left-1 text-sm px-5 py-1"><?php echo $dsp;?>% OFF</span>
      <?php } ?>
    </div>
    <div class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">
    <?php if($seling_price!=''){ ?>
    <span class="text-2xl font-bold text-[#f00000]">$<?php echo $seling_price; ?></span>
    <span class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">$<?php echo $mrp; ?></span>
    <?php  }else{ ?>
    <span class="text-2xl font-bold text-[#f00000]">$<?php echo $mrp; ?></span>
    <?php } ?>
    </div>
    <div class="text-center mb-7">
      <h6 class="text-lg text-primary font-normal"><?php the_title(); ?></h6>
      <p class="text-sm"><?php echo wp_trim_words( get_the_content(), 10, '...' ); ?></p>
    </div>
    <div class="flex items-center">
      <?php echo '<a href="?add-to-cart='.get_the_id($product).'" title="Add to cart" class="btn btn-primary w-full btn--order">Order Now</a>'; ?>
      <?php echo do_shortcode("[ti_wishlists_addtowishlist loop=no]");?>
    </div>
  </div>
</div>
