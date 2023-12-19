<?php
/**
 * Template Name: Learning Center Page
*/
get_header();
while ( have_posts() ) : the_post();
?>
<!-- SITE CONTENT -->
<main class="site-content site-content--learning-center">
  <section class="pagetitle-section position-relative" style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/banner.webp)">
    <div class="container position-relative">
      <h1 class="text-primary text-uppercase fw-bold pagetitle">Learning Center</h1>
    </div>
  </section>
  <section class="section--py">
    <div class="text-center">
      <img src="<?php echo get_template_directory_uri();?>/assets/images/soon.png" alt="Coming Soon" class="d-inline-block" />
      <h3 class="text-dark fw-semibold mt-4 mb-0">Content Coming Soon!</h3>
    </div>
  </section>
</main>
<?php
endwhile; // End of the loop.
get_footer();
