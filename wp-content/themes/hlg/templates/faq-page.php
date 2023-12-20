<?php
/**
 * Template Name: FAQ Page
*/
get_header();
while ( have_posts() ) : the_post();
?>
<!-- SITE CONTENT -->
<main class="site-content site-content--services">
  <section class="pagetitle-section position-relative" style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/faqs-pagetitle-banner.webp)">
    <div class="container position-relative">
      <h1 class="text-primary text-uppercase fw-bold pagetitle">FAQs</h1>
    </div>
  </section>
  <section class="section--py faqs-section">
    <div class="container">
      <div class="row g-lg-4 g-xl-5 align-items-center">
        <div class="col-12 col-lg-6 mb-4 mb-lg-0">
          <div class="row justify-content-center">
            <div class="col-12 col-md-9 col-lg-12">
              <div class="ratio ratio-4x3">
                <img src="<?php the_field('faq_left_image'); ?>" alt="Faqs Image" width="400" height="300" class="w-100 h-100 object-cover rounded" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-6 pt-2 pt-lg-0">
          <div class="accordion-container mb-4 ps-xl-5 ps-xxl-4">
            <h2 class="text-primary fw-bold mb-4">Do you have questions?</h2>           

            <?php
              while ( have_rows('faq') ) : the_row();
            ?>
            <div class="set">
              <a href="javascript:void(0)">
                <span> <?php echo the_sub_field('faq_title'); ?>?</span>
                <i class="fa fa-plus" aria-hidden="true"></i>
              </a>
              <div class="content">
                <p><?php echo the_sub_field('faq_description'); ?></p>
              </div>
            </div>
            <?php
              endwhile; 
            ?>


          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Get In Touch Section -->
  <section class="get-in-touch-section overflow-x-hidden">
    <iframe src="<?php the_field('address_map', 'options'); ?>" width="100%" height="600" style="border: 0" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    <div class="row justify-content-center">
      <div class="col-11 col-md-10 col-lg-10 col-xl-8 col-xxl-7">
        <div class="get-in-touch-form-container bg-white">
          <h2 class="fw-bold text-primary section__title text-center text-uppercase">Get In Touch</h2>
           <?php echo do_shortcode('[contact-form-7 id="54" title="GET IN TOUCH"]');?>
        </div>
      </div>
    </div>
  </section>
</main>
<?php
endwhile; // End of the loop.
get_footer();
