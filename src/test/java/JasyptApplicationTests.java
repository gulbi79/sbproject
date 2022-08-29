import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.junit.jupiter.api.Test;

class JasyptApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    void jasypt() {
//        String url = "jdbc:log4jdbc:oracle:thin:@130.162.132.213:1521/xe";
        String url = "jdbc:oracle:thin:@130.162.132.213:1521/xe";
        String username = "SUNG";
        String password = "a1234";

        System.out.println("url:" + jasyptEncoding(url));
        System.out.println("username:" + jasyptEncoding(username));
        System.out.println("password" + jasyptEncoding(password));
    }

    public String jasyptEncoding(String value) {

        String key = "my_jasypt_key";
        StandardPBEStringEncryptor pbeEnc = new StandardPBEStringEncryptor();
        pbeEnc.setAlgorithm("PBEWithMD5AndDES");
        pbeEnc.setPassword(key);
        return pbeEnc.encrypt(value);
    }

}