<html>
    <head>
        <link href='https://fonts.googleapis.com/css?family=Bangers' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Titillium+Web&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
        <script src="cartes.js"></script>
        <script src="script.js"></script>
        <link href='style.css' rel='stylesheet' type='text/css'>
        <link rel="icon" type="image/png" href="image/logo.png" />
    </head>
    <script type="text/javascript">
    $(window).on('load',function() {
        var navigateur = navigator.userAgent;
        if (navigateur.match('Chrome') == null || navigateur.match('Mobile') != null) {
            alert('Jeu uniquement jouable sur le navigateur Chrome sur PC');
            //Window.stop();
        }
        $("#preloader").remove();
    });
</script>

<body>
    <div id="preloader">
        <div id='main'>
            <div id='home'>
                <div class='logo'><img src='image/logo.png'></div>
                <img src="image/loader.gif">
            </div>
        </div>
    </div>
    <map id="selector">
        <area shape='rect' coords='0,0 500,500' id='gauche'>
        <area shape='rect' coords='0,0 500,500' id='droite'>
        <area shape='rect' coords='0,0 500,500' id='gauche_bg'>
        <area shape='rect' coords='0,0 500,500' id='droite_bg'>
    </map>
    <i id="BoutonRetour" onclick='PlayAudioClic();' class="fas fa-arrow-circle-left bouton_retour div_cacher"></i>
    <div id='main'>
        <div id='home'>
            <div class='logo'><img src='image/logo.png'></div>
            <ul id="Listbutton">
                <li id='jouer' onclick='PlayAudioClic();' class="bouton_actif">Jouer</li>
                <li id="charger" onclick='PlayAudioClic();' class="bouton_actif">Charger une sauvegarde</li>
                <li id='succes'  onclick='PlayAudioClic();' class="bouton_actif">Succès</li>
                <li id='credit' class="bouton_actif">Crédits</li>
            </ul>
            <div id='setup' class='fas fa-cog' onclick='PlayAudioClic();'></div>
        </div>
        <div id="carte">
        </div>
        <div id="div_setup">
            <div class='logo'><img src='image/logo.png'></div>
            <p id="text-volume">Volume général</p>
            <div id="icon-audio" class="fas fa-volume-up">
                <div id="reglage_volume"><input type='range' id="volume" min=0 max =100  oninput="UpdateVolume(this.value)" onchange="UpdateVolume(this.value)" /></div>
            </div>
            <i onclick='PlayAudioClic();' class="fas fa-arrow-circle-left bouton_retour"></i>
        </div>
        <div id="div_charger" class="div_cacher">
            <div class='logo'><img src='image/logo.png'></div>
            <div>
                <p>Merci d'entrer votre pseudo pour charger votre sauvegarde</p>
                <div id="formulaire">
                    <input type="text" id="pseudo_charger" name="pseudo" />
                    <input type="button" name="charger" id="charger_partie" value="Charger"/>
                </div>
            </div>
            <i  onclick='PlayAudioClic();' class="fas fa-arrow-circle-left bouton_retour"></i>
        </div>
        <div id="div_succes" class="div_cacher">
            <h1>Liste des succès</h1>
            <ul id="liste_succes">
            </ul>
            <i onclick='PlayAudioClic();' class="fas fa-arrow-circle-left bouton_retour"></i>
        </div>
        <div id="div_parametre_partie" class="div_cacher">
            <h1>Paramètres de la partie</h1>
            <label>Choix de la difficulté</label>
            <select id="difficulte">
                <option value="1">Normal</option>
                <option value="2">Difficile</option>
            </select>
            <p>En <b>Normal</b>, votre survie sera aidée par des indicateurs visuels.<br>
            En <b>Difficile</b>, ces indicateurs ne sont pas présents vous permettant une meilleure immersion dans l'histoire.</p>
            <label>Tutoriel</label>
            <label class="switch">
              <input type="checkbox" id='InputTuto' checked>
              <span class="slider round"></span>
            </label>
            <p id="StartGame" class="bouton bouton_actif">Commencer la partie</p>
            <i  onclick='PlayAudioClic();' class="fas fa-arrow-circle-left bouton_retour"></i>
        </div>
        <div id="div_credit" class="div_cacher">
            <div class='logo'><img src='image/logo.png'></div>
            <p>
                Survapo est un jeu réalisé par Gabrielle Hemery,Hugo Cressent et Philemon Cantereau dans le cadre de l'UV IC06 : Industrie et conception des jeux vidéos.
                Il a donc été réalisé dans un temps très limité.
                <br>
                <br>
                <b>Crédit images :</b><br>
                Freepik, monkik, Good Ware, smalllikeart, Nikita Golubev, turkkub, Smashicons, Eucalyp, itim2101, photo3idea_studio de <a target="_blank"  href='http://www.flaticon.com'>www.flaticon.com</a>
                <br>
                <br>
                <b>Crédit audio :</b><br>
                <a target="_blank"  href="https://www.epidemicsound.com/">https://www.epidemicsound.com/</a>


            </p>
            <i onclick='PlayAudioClic();' class="fas fa-arrow-circle-left bouton_retour"></i>
        </div>
        <div id='div_jeu' class="div_cacher">
            <div id="souris"><img src="image/souris.png"/></div>
            <header>
                <ul id="tempstat">
                    <li>Faim</li>
                    <li>Énergie</li>
                    <li>Mental</li>
                    <li>Santé</li>
                </ul>
                <div id="impact">
                    <div id='impact-faim'></diV>
                    <div id='impact-fatigue'></diV>
                    <div id='impact-mental'></diV>
                    <div id='impact-sante'></diV>
                </div>
                <div id='faim' class="stat fas fa-apple-alt"><div id='value-faim'><i class="fas fa-apple-alt"></i></div></div>
                <div id='fatigue' class="stat fas fa-walking"><div id='value-fatigue'><i class="fas fa-walking"></i></div></div>
                <div id='mental' class="stat fas fa-brain"><div id='value-mental'><i class="fas fa-brain"></i></div></div>
                <div id='sante' class="stat fas fa-heart"><div id='value-sante'><i class="fas fa-heart"></i></div></div>
            </header>
            <div id='center'>
                <p id='description'></p>
                <div id="block-carte">
                    <div id='img' class=""><div class='front'><p class='ecriture_ds_carte'></p></div><div class='back'></div></div>
                    <div id='currentcard'><div id='display_current'><p class='ecriture_ds_carte'></p></div></div>
                    <div id='fakecard'><div class='back'></div></div>
                </div>
            </div>
            <p id='textG'></p>
            <p id='textD'></p>
            <div id='compteur'>Jour : <span id="nb_jour"/>1<span></div>
            <div id='popup-succes'><i class="fas fa-times-circle" id="popup-close"></i><img id="star-succes" class="rotation" src = "image/succes/star.png"><img id="popup-img-succes"/><p id="popup-nom">Succès obtenu :</p><p id="popup-desc"></p></div>
            <div id="Drop_inv">
                <div class="">
                    <p>Vos poches sont pleines !</p>
                    <p>Vous ne pouvez pas ramasser : <span id="nom_drop"></span></p>
                    <p>Cliquez sur un objet pour le jeter</p>
                    <?php for($i=1;$i<=4;$i++) {
                        echo "<div id='dropinv{$i}' class='items drop' data-id = '{$i}'><div id='drop-img-inv{$i}'></div><span class='info-items' id='drop-info-items{$i}'><span class='arrow'></span><h1 id='drop-titre-inv{$i}'></h1><h2 id='drop-util-inv{$i}' class='red'></h2></span></div>";
                    } ?>
                    <div id='dropinv5' class='items drop border-red fa fa-trash-alt' data-id='5'><span class='info-items' id='drop-info-items5'><span class='arrow'></span><h1 id='drop-titre-inv5'>Ne pas prendre</h1></span></div>
                </div>
            </div>
            <footer>
                <p id="inventaire">Inventaire</p>
                <?php for($i=1;$i<=4;$i++) {
                    echo "<div id='inv{$i}' class='items vide' data-id = '{$i}'><div id='img-inv{$i}'></div><span class='info-items' id='info-items{$i}'><span class='arrow'></span><h1 id='titre-inv{$i}'></h1><h2 id='util-inv{$i}' class='red'></h2></span></div>";
                } ?>
                <div>
                    <?php
                    for($i=1;$i<=4;$i++) {
                        echo "<div class ='item-star'><img id='item-star".$i."' class='rotation' src='image/items/star.png'></div>";
                    } ?>
                </div>
            </footer>
        </div>
    </div>
    <div id="chargement_cache" style='display:none'>
        <?php
            function AfficherImageDossier($dir_nom) {
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
                        echo "<img src=\"$dir_nom/$lien \">";
                    }
                 }
            }
            AfficherImageDossier('image');

        ?>
    </div>
</body>
</html>
