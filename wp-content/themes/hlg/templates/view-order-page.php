<?php
/**
 * Template Name: View Order Page
*/
get_header();
while ( have_posts() ) : the_post();
    $user_id = is_user_logged_in();
    $fname = get_user_meta( $user_id->ID, 'first_name', true );
    $lname = get_user_meta( $user_id->ID, 'last_name', true );
    $user_email = esc_attr( $user_id->user_email ); 
    $billing_phone = get_user_meta( $user_id->ID, 'billing_phone', true );
?>
<main class="site-content site-content--my-account overflow-x-hidden">
        <section class="bg-primaryDark account-overview-section py-5">
        <div class="container">
            <div class="row account-overview align-items-center flex-column-reverse flex-md-row">
                <div class="col-12 col-md-6 text-center text-md-start">
                    <h4 class="text-white"><?php echo $fname ?> <?php echo $lname ?></h4>
                    <p class="text-white"><span class="pe-2"><?php echo $user_email ?></span>|<span class="ps-2">+91 <?php echo $billing_phone; ?></span></p>
                </div>
                <div class="col-12 col-md-6 d-flex justify-content-center justify-content-md-end">
                    <figure class="account-overview__profile-img d-flex align-items-center justify-content-center rounded-circle overflow-hidden">
                        <img src="https://dummyimage.com/150x150/000/fff" alt="profile title" class="w-100 h-100 fit-cover">
                        <div class="upload-btn-wrapper">
                            <button class="btn text-white text-xs">Upload a file</button>
                            <input type="file" name="myfile" />
                        </div>
                    </figure>
                </div>
            </div>
        </div>
    </section>

    <section class="account-main-section section--pb-extra">
        <div class="container">
            <?php the_content(); ?>
        </div>
    </section>
</main>
<?php
endwhile; // End of the loop.
get_footer();
