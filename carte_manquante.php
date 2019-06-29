    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
    <script src="cartes.js"></script>
    <div id="manque">Cartes manquantes :<br></div>
    <div id="entrop">Cartes en trop : <br></div>
    <div id="suitemanquante">Erreur de suite : <br></div>
    <?php
    $ListeImages = array();
    function AfficherImageDossier($dir_nom) {
        global $ListeImages;
        $dir = opendir($dir_nom) or die('Erreur de listage : le répertoire n\'existe pas'); // on ouvre le contenu du dossier courant
        $fichier= array(); // on déclare le tableau contenant le nom des fichiers
        $dossier= array(); // on déclare le tableau contenant le nom des dossiers

        while($element = readdir($dir)) {
            if($element != '.' && $element != '..') {
                if (!is_dir($dir_nom.'/'.$element)) {$fichier[] = $element;}
                else {$dossier[] = $element;}
            }
        }

        closedir($dir);
        if(!empty($dossier)) {
            foreach($dossier as $lien){
                AfficherImageDossier($dir_nom.'/'.$lien);
            }
        }

        if(!empty($fichier)){
            foreach($fichier as $lien) {
                $ListeImages[] = substr($lien,0,-4);
            }
         }
    }
    AfficherImageDossier('image/cartes');
    $ListeImages = json_encode($ListeImages);
    ?>
    <script>
    $(document).ready(function() {
        Object.keys(ListeCarte).forEach(function(Nom) {
            UrlExists(Nom);
            ListeCarte[Nom].suiteG.forEach(function(NomCarteG) {
                if (!ListeCarte.hasOwnProperty(NomCarteG)) {
                    console.log(Nom);
                    console.log(ListeCarte[Nom].suiteG);
                    $('#suitemanquante').append('Erreur SuiteG pour '+Nom+' : Cherche à atteindre : '+NomCarteG+'<br>');
                }
            });
            ListeCarte[Nom].suiteD.forEach(function(NomCarteD) {
                if (!ListeCarte.hasOwnProperty(NomCarteD)) {
                    console.log(Nom);
                    console.log(ListeCarte[Nom].suiteD);
                    $('#suitemanquante').append('Erreur SuiteD pour '+Nom+' : Cherche à atteindre : '+NomCarteD+'<br>');
                }
            });
        });
        var ListeImage = JSON.parse('<?php echo $ListeImages; ?>');
        ListeImage.forEach(function(elm) {
            if (!ListeCarte.hasOwnProperty(elm)) {
                $('#entrop').append(elm+'<br>');
            }
        })
    });
    function UrlExists(Nom)
    {
        var http = new XMLHttpRequest();
        http.open('HEAD', 'image/cartes/'+ Nom + '.png', true);
        http.onload = function () {
            if (http.status==404){
                $('#manque').append(Nom+'<br>');
            }
        }
        http.send();
    }
    </script>
