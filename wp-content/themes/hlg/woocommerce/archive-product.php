<?php
/**
 * The Template for displaying product archives, including the main shop page which is a post type archive
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/archive-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 3.4.0
 */

defined( 'ABSPATH' ) || exit;

get_header();

/**
 * Hook: woocommerce_before_main_content.
 *
 * @hooked woocommerce_output_content_wrapper - 10 (outputs opening divs for the content)
 * @hooked woocommerce_breadcrumb - 20
 * @hooked WC_Structured_Data::generate_website_data() - 30
 */
do_action( 'woocommerce_before_main_content' );

?>
<main class="site-content site-content--products"> 

<section class="pagetitle-section">
  <div class="pagetitle-section__top bg-light bg-center bg-cover bg-no-repeat"
    style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/contact-us-pagetitle-bg.jpg)">
    <div class="container relative">
      <h1 class="pagetitle">Products</h1>
    </div>
  </div>
  <div class="pagetitle-section__bottom bg-primary">
    <div class="container">
      <nav class="w-full breadcrumb text-center">
        <ol class="list-reset inline-flex py-4 border-b border-b-borderColor">
          <li><a href="<?php echo home_url(); ?>">Home</a></li>
          <li><span class="mx-2">-</span></li>
          <li>Products</li>
        </ol>
      </nav>
    </div>
  </div>
</section>

<section class="section--py products-archive-section">
      <div class="container">
        <div class="grid grid-cols-12 gap-y-7 md:gap-x-5 lg:gap-y-0 lg:gap-x-6 xl:gap-7 2xl:gap-8">
        	<?php get_sidebar('left'); ?>
          <div class="col-span-12 lg:col-span-8 xl:col-span-9">
            <div class="grid grid-cols-12 gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 products-grid"> 
				<?php
				if ( woocommerce_product_loop() ) {

				/**
				 * Hook: woocommerce_before_shop_loop.
				 *
				 * @hooked woocommerce_output_all_notices - 10
				 * @hooked woocommerce_result_count - 20
				 * @hooked woocommerce_catalog_ordering - 30
				 */
				do_action( 'woocommerce_before_shop_loop' );

				woocommerce_product_loop_start();

				if ( wc_get_loop_prop( 'total' ) ) {
					while ( have_posts() ) {
						the_post();

						/**
						 * Hook: woocommerce_shop_loop.
						 */
						do_action( 'woocommerce_shop_loop' );

						wc_get_template_part( 'content', 'product' );
					}
				}

				woocommerce_product_loop_end();

				/**
				 * Hook: woocommerce_after_shop_loop.
				 *
				 * @hooked woocommerce_pagination - 10
				 */
				do_action( 'woocommerce_after_shop_loop' );
				} else {
				/**
				 * Hook: woocommerce_no_products_found.
				 *
				 * @hooked wc_no_products_found - 10
				 */
				do_action( 'woocommerce_no_products_found' );
				}

				/**
				* Hook: woocommerce_after_main_content.
				*
				* @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
				*/
				do_action( 'woocommerce_after_main_content' );

				/**
				* Hook: woocommerce_sidebar.
				*
				* @hooked woocommerce_get_sidebar - 10
				*/
				?>

              
            </div>

            <!-- <div class="flex justify-end mt-8">
              <nav aria-label="Page navigation example" class="pagination">
                <ul class="flex list-style-none">
                  <li class="page-item disabled mr-2 last:mr-0"><a class="page-link" href="#" tabindex="-1"
                      aria-disabled="true">Previous</a></li>
                  <li class="page-item mr-2 last:mr-0"><a class="page-link " href="#">1</a></li>
                  <li class="page-item mr-2 last:mr-0 active"><a class="page-link " href="#">2 <span
                        class="visually-hidden">(current)</span></a></li>
                  <li class="page-item mr-2 last:mr-0"><a class="page-link" href="#">3</a></li>
                  <li class="page-item mr-2 last:mr-0"><a class="page-link" href="#">Next</a></li>
                </ul>
              </nav>
            </div> -->
          </div>
        </div>
      </div>
    </section>
</main>			
<?php get_footer(); ?>