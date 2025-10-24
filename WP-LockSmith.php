<?php

/**
 * Small class for encrypting / decrypting API keys saved to the database.
 * (keys may be saved as part of plugin config)
 */
class LockSmith
{
    private static string $smith_key = 'dcac-apik';

    static function encrypt(string $plain)
    {
        if (empty($plain)) {
            return $plain;
        }

        $h = hash('sha256', self::getSmithKey());
        $iv = substr(hash('sha256', 'dcac-iv-' . site_url()), 0, 16);

        return base64_encode(openssl_encrypt($plain, 'AES-256-CBC', $h, 0, $iv));
    }

    static function decrypt(string $encryped)
    {
        $h = hash('sha256', self::getSmithKey());
        $iv = substr(hash('sha256', 'dcac-iv-' . site_url()), 0, 16);

        return openssl_decrypt(base64_decode($encryped), 'AES-256-CBC', $h, 0, $iv);
    }

    /**
     * Return an obfuscated, 'fake' string value that still matches the length of given
     */
    static function getDummyValue(string $value)
    {
        $length = strlen($value);
        $dum = '';
        for ($i = 0; $i < $length; $i++) {
            $dum .= '*';
        }
        return $dum;
    }

    /**
     * Need to do some weird stuff here:
     * 1. If the input was not updated by user, need to re-save the previous value
     * 2. If the input WAS updated by user, need to save the new value
     * 3. In both 1) and 2), the values need to be encrypted for saving
     * 
     * relies on 'dirty/clean' marker (a hidden input) to detect whether to save a new value or not.
     */
    static function sanitizePasswordInput($cur_value, $new_value, $option_name)
    {
        $marker_name = $option_name . '-dirty';

        if (empty($new_value)) {
            // assume empty value means input was cleared, so just return it as-is
            return $new_value;
        } else {
            if ($_POST && $_POST[$marker_name] == 'true') {
                return self::encrypt($new_value);
            } else {
                return $cur_value;
            }
        }
    }

    static function deleteSmithKey()
    {
        delete_option(self::$smith_key);
    }

    ///////////////////////////////////

    private static function getSmithKey()
    {
        $rtn = get_option(self::$smith_key);
        if (!$rtn) {
            $key = $rtn = wp_generate_password(64, true, true);
            update_option(self::$smith_key, $key);
        }
        return $rtn;
    }
}
