package com.example.demo;

import org.springframework.stereotype.Service;

@Service
public class ChatbotService {

    public String getReply(String message) {

        if (message == null || message.isBlank()) {
            return "Please type a message so I can help you.";
        }

        message = message.toLowerCase();

        // =========================================================
        // 🌍 HUMAN INTERACTION LAYER (ENGLISH)
        // =========================================================
        if (message.equals("thanks")
                 || message.equals("thank you")
                 || message.equals("thx")
                 || message.equals("ty")
                 || message.equals("appreciate it")
                 || message.equals("cheers")
                 || message.equals("ok thanks")
                 || message.equals("ok great")
                 || message.equals("nice")
                 || message.equals("cool")
                 || message.equals("perfect")) {

                    return "Glad I could help 👍 If you need anything else, just tell me.";
                }

                if (message.equals("sorry")
                 || message.equals("my bad")
                 || message.equals("oops")
                 || message.equals("oopsie")
                 || message.equals("excuse me")) {

                    return "No worries at all 👍 How can I help you now?";
                }

                if (message.equals("bye")
                 || message.equals("goodbye")
                 || message.equals("see you")
                 || message.equals("cya")
                 || message.equals("see ya")
                 || message.equals("talk later")) {

                    return "Take care 👋 If you need help again, I’ll be here.";
                }

                if (message.equals("wow")
                 || message.equals("omg")
                 || message.equals("wtf")
                 || message.equals("damn")
                 || message.equals("crazy")
                 || message.equals("insane")) {

                    return "Yeah 😄 tell me what’s going on and I’ll help you with it.";
                }

        // =========================================================
        // ENGLISH GREETING
        // =========================================================
                if (message.equals("hi")
                         || message.equals("hello")
                         || message.equals("hey")
                         || message.equals("good morning")
                         || message.equals("good afternoon")
                         || message.equals("good evening")) {

                            return "Hey 👋 I’m here to help you step by step. What do you need?";
                        }

        // =========================================================
        // CREDIT CARD (EN)
        // =========================================================
        if (message.contains("card") || message.contains("cards") || (message.contains("card") && message.contains("credit"))) {

            if (message.contains("add") || message.contains("new")) {
                return "To add a new card, go to Credit Card → Add New Card and follow the instructions.";
            }

            else if (message.contains("lost") || message.contains("stolen")) {
                return "That sounds serious — your card might be at risk. Freeze it immediately, go to credit cards → card setting → block card.";
            }

            else if (message.contains("blocked")) {
                return "Your card is blocked. You can check the reason in Security settings.";
            }

            else {
                return "You can manage everything related to your cards in Credit Card → My Cards.";
            }
        }

        // =========================================================
        // CREDIT (EN)
        // =========================================================
        if (message.contains("credit") && !message.contains("card")) {

            if (message.contains("history")) {
                return "You can check all your credit requests in Credit → Request History.";
            }

            else if (message.contains("rejected")) {
                return "Your credit request was rejected, usually due to missing documents or eligibility issues.";
            }

            else {
                return "To apply for credit, go to Credit → Credit Request.";
            }
        }

        // =========================================================
        // TRANSFER (EN)
        // =========================================================
        if (message.contains("transfer")) {

            if (message.contains("failed") || message.contains("error")) {
                return "Your transfer didn’t go through. Double-check the details and try again.";
            }

            else if (message.contains("history")) {
                return "You can view all your transfers in Transfer → History.";
            }

            else {
                return "To send money, go to Transfer → Bank Transfer.";
            }
        }

        // =========================================================
        // STOCKS (EN)
        // =========================================================
        if (message.contains("order")) {
            return "Go to Stocks → Stock Order to place a buy or sell order.";
        }

        else if (message.contains("market")) {
            return "Market Watch shows live prices and market trends in real time, to visit it go to Stocks → market watch.";
        }

        else if (message.contains("portfolio")) {
            return "Your Portfolio shows all your investments and how they are performing, to visit it go to Stocks → Portfolio.";
        }

        else if (message.contains("stock") || message.contains("trade")) {

            if (message.contains("history")) {
                return "You can check your trading history in Stocks → Order History.";
            }

            else {
                return "In Stocks, you can trade, follow the market, and manage your portfolio.";
            }
        }

        // =========================================================
        // SETTINGS (EN)
        // =========================================================
        if (message.contains("settings") || message.contains("password")) {

            if (message.contains("reset") || message.contains("forgot")) {
                return "If you forgot your password, you can reset it in Settings → Reset Password.";
            }

            else {
                return "You can manage your account and security in the Settings section.";
            }
        }

        // =========================================================
        // FRENCH HUMAN LAYER
        // =========================================================

        if (message.equals("merci")
                 || message.equals("merci beaucoup")
                 || message.equals("thanks")
                 || message.equals("thx")
                 || message.equals("ok merci")
                 || message.equals("super")
                 || message.equals("parfait")) {

                    return "Avec plaisir 😊 Je suis là si vous avez besoin d’aide.";
                }

                if (message.equals("désolé")
                 || message.equals("pardon")
                 || message.equals("desole")
                 || message.equals("oops")) {

                    return "Pas de souci 👍 Comment puis-je vous aider ?";
                }

                if (message.equals("au revoir")
                 || message.equals("bye")
                 || message.equals("à bientôt")
                 || message.equals("ciao")
                 || message.equals("salut")) {

                    return "À bientôt 👋 N’hésitez pas si vous avez besoin d’aide.";
                }

                if (message.equals("incroyable")
                 || message.equals("wow")
                 || message.equals("omg")
                 || message.equals("choqué")
                 || message.equals("grave")) {

                    return "Oui 😄 explique-moi et je vais t’aider.";
                }

                if (message.equals("bonjour")
                 || message.equals("salut")
                 || message.equals("bonsoir")
                 || message.equals("coucou")) {

                    return "Bonjour 👋 Je suis là pour vous aider. Dites-moi ce dont vous avez besoin.";
                }

        // =========================================================
        // CARTE (FR)
        // =========================================================
        if (message.contains("carte")) {

            if (message.contains("ajouter")) {
                return "Pour ajouter une carte, allez dans la section Carte puis suivez les instructions.";
            }

            else if (message.contains("perdue") || message.contains("volée") || message.contains("volee")) {
            	return "Cela semble sérieux — votre carte pourrait être en danger. Pour votre sécurité, bloquez-la immédiatement dans Crédit → Paramètres de carte → Bloquer la carte.";            }

            else {
                return "Vous pouvez gérer vos cartes dans Carte → Mes cartes.";
            }
        }

        // =========================================================
        // CRÉDIT (FR)
        // =========================================================
        if (message.contains("crédit") && !message.contains("carte") || message.contains("credit")) {

            if (message.contains("historique")) {
                return "Vous pouvez consulter vos demandes dans Crédit → Historique.";
            }

            else if (message.contains("refusé") || message.contains("refuse")) {
                return "Votre demande de crédit a été refusée.";
            }

            else {
                return "Allez dans Crédit → Demande de crédit.";
            }
        }

        // =========================================================
        // VIREMENT (FR)
        // =========================================================
        if (message.contains("virement") || message.contains("transfert")) {

            if (message.contains("erreur") || message.contains("échoué") || message.contains("echoue")) {
                return "Le virement a échoué. Vérifiez les informations.";
            }

            else if (message.contains("historique")) {
                return "Vous pouvez voir vos virements dans Virement → Historique.";
            }

            else {
                return "Allez dans Virement → Nouveau virement.";
            }
        }

        // =========================================================
        // STOCKS (FR)
        // =========================================================
        if (message.contains("ordre")) {
            return "Dans Bourse, vous pouvez passer des ordres d’achat ou de vente. Pour y accéder, allez dans Bourse → Ordre.";
        }

        else if (message.contains("marché") || message.contains("marche")) {
            return "Le marché vous montre les prix en temps réel. Pour y accéder, allez dans Bourse → Marché.";
        }

        else if (message.contains("portefeuille")) {
            return "Votre portefeuille affiche vos investissements. Pour y accéder, allez dans Bourse → Portefeuille.";
        }

        else if (message.contains("bourse") || message.contains("actions")) {

            if (message.contains("historique")) {
                return "Vous pouvez consulter votre historique dans la Bourse.";
            }

            else {
                return "Dans la Bourse, vous pouvez trader et suivre le marché.";
            }
        }

        // =========================================================
        // SETTINGS (FR)
        // =========================================================
        if (message.contains("paramètres") || message.contains("parametres") || message.contains("mot de passe")) {

            if (message.contains("réinitialiser") || message.contains("oublié") || message.contains("oublie")) {
                return "Vous pouvez réinitialiser votre mot de passe dans Paramètres.";
            }

            else {
                return "Dans Paramètres, vous pouvez gérer votre compte.";
            }
        }

        // =========================================================
        // DEFAULT
        // =========================================================
        return "I’m here to help you with Credit, Cards, Transfers, Stocks, and Settings 👍 Just tell me what you need.";
    }
}
