import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
class CheckPwd {
  public static void main(String[] a) {
    var e = new BCryptPasswordEncoder();
    String h = "$2a$10$b.tsAbJjUpBuzZYaepVI7.HGeFdq55XUjFzKIAFbFAsEeNkcmxKny";
    for (String p : new String[]{"Test1234","admin123","admin","password","Password123"})
      System.out.println(p + " -> " + e.matches(p, h));
  }
}
