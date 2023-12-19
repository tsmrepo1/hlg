<?php
/**
 * Template Name: Wishlist Page
*/
get_header();
while ( have_posts() ) : the_post();
?>
<main class="site-content site-content--cart">
<section class="pagetitle-section pagetitle-section--has-bg">
    <div class="container position-relative">
        <div class="row align-items-center">
            <div class="col-12 col-lg-5">
                <h3 class="pagetitle py-2 text-uppercase text-center text-lg-start fw-bold mb-0"><?php the_title(); ?></h3>
            </div>
            <div class="col-12 col-lg-7">
                <nav aria-label="breadcrumb" class="d-flex justify-content-center justify-content-lg-end position-relative">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item fw-semibold"><a href="<?php echo home_url(); ?>">Home</a></li>
                        <li class="breadcrumb-item fw-semibold active" aria-current="page"><span class="px-2 py-1 ms-1"><?php the_title(); ?></span></li>
                    </ol>
                </nav>
            </div>
        </div>
    </div>
</section>
<section class="cart-section section--py bg-light">
        <div class="container position-relative">
            <?php the_content(); ?>
        </div>
</section>


</main>
<?php
endwhile; // End of the loop.
get_footer();
