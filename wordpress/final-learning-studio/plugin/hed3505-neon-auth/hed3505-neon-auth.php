<?php
/**
 * Plugin Name: HED3505 Neon Auth Bridge
 * Description: Staging-only HED3505 loader for the approved Neon JS authentication bundle.
 * Version: 0.1.0
 * Author: HED3505
 */
if (!defined('ABSPATH')) { exit; }

add_action('wp_enqueue_scripts', function () {
    if (!is_page(117)) { return; }
    $asset = plugin_dir_path(__FILE__) . 'assets/hed3505-neon-auth.js';
    if (!is_readable($asset)) { return; }
    wp_enqueue_script(
        'hed3505-neon-auth-sdk',
        plugins_url('assets/hed3505-neon-auth.js', __FILE__),
        array(),
        (string) filemtime($asset),
        true
    );
}, 20);
