{ config, pkgs, ... }

{

  networking.hosts = {
    "192.168.1.1" = [ "tam.lan" ]; # Change the IP of this line to the IP of the TAM server if applicable.
  };

  users.users."tam" = {
    isNormalUser = true;
    description = "Ticket Auction Manager";
  };

  services.displayManager.sddm.settings.Autologin = {
    Session = "plasma.desktop";
    User = "tam";
  };

  environment.systemPackages = with pkgs; [
    chromium
  ];

  virtualisation.docker.enable = true;

  virtualisation.oci-containers = {
    backend = "docker";
    containers."tam-client" = {
      image = "dbob16/tam-client:0.1.0"; # Change image to local repo to avoid pull limits.
      volumes = [
        "tam-data:/data"
      ];
      environment = {
        HOST = "localhost";
        PORT = "3000";
      };
      extraOptions = ["--network=host"]
    };
  };

}
