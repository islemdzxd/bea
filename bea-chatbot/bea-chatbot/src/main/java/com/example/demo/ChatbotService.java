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
        // 🌍 HUMAN INTERACTION LAYER (ENGLISH + FRENCH KEYWORDS)
        // This service uses simple keyword matching to provide helpful,
        // actionable answers in either English or French depending on
        // the user's message. Responses are intentionally more detailed.
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

                    return "Glad I could help 👍 If you need anything else, just tell me. For example, you can ask: 'How do I check my balance?' or 'How do I report a lost card?'";
                }

                if (message.equals("sorry")
                 || message.equals("my bad")
                 || message.equals("oops")
                 || message.equals("oopsie")
                 || message.equals("excuse me")) {

                    return "No worries at all 👍 How can I help you now? You can ask about your account, recent transactions, or how to contact support.";
                }

                if (message.equals("bye")
                 || message.equals("goodbye")
                 || message.equals("see you")
                 || message.equals("cya")
                 || message.equals("see ya")
                 || message.equals("talk later")) {

                    return "Take care 👋 If you need help again, I’ll be here. Tip: you can type 'restart' to start over.";
                }

                if (message.equals("wow")
                 || message.equals("omg")
                 || message.equals("wtf")
                 || message.equals("damn")
                 || message.equals("crazy")
                 || message.equals("insane")) {

                    return "Yeah 😄 tell me what’s going on and I’ll help you with it. Try asking: 'Why was my transaction declined?' or 'How to open an account?'";
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

                            return "Hey 👋 I’m here to help you step by step. What do you need? You can ask in English or French.";
                        }

        // =========================================================
        // ACCOUNT / BALANCE
        // =========================================================
        if (message.contains("balance") || message.contains("solde") || message.contains("my balance") || message.contains("mon solde")) {
            return "You can check your account balance in the app under Accounts → Balances. If you prefer, I can guide you step‑by‑step: open the app, go to 'Accounts', then select the account to see real‑time balance and pending transactions.\nSi vous préférez en français : ouvrez l'application → Comptes → Sélectionnez le compte pour voir le solde et opérations en attente.";
        }

        // =========================================================
        // CREDIT CARD (EN)
        // =========================================================
        if (message.contains("card") || message.contains("cards") || (message.contains("card") && message.contains("credit"))) {

            if (message.contains("add") || message.contains("new")) {
                return "To add a new card, go to Credit Card → Add New Card and follow the instructions. You'll need to confirm your identity and enter the card details.\nAstuce: pour ajouter une carte, allez dans Carte → Ajouter une nouvelle carte et suivez les instructions.";
            }

            else if (message.contains("lost") || message.contains("stolen")) {
                return "That sounds serious — your card might be at risk. Freeze it immediately in the app (Cards → Card settings → Block card) or call our emergency number.\nEn cas de perte/vol, bloquez la carte via l'application et contactez le service client.";
            }

            else if (message.contains("blocked")) {
                return "Your card is blocked. You can check the reason in Security → Card Status. If you need to unblock it, follow the verification steps in the app or contact support for manual assistance.";
            }

            else {
                return "You can manage everything related to your cards in Cards → My Cards: view limits, recent transactions, block/unblock, and set contactless preferences.\nPour gérer vos cartes : Cartes → Mes cartes.";
            }
        }

        // =========================================================
        // CREDIT (EN)
        // =========================================================
        if (message.contains("credit") && !message.contains("card")) {

            if (message.contains("history")) {
                return "You can check all your loan/credit requests in Credit → Request History. Each request shows status, required documents and next steps.\nVous pouvez voir vos demandes et pièces manquantes dans Crédit → Historique.";
            }

            else if (message.contains("rejected")) {
                return "If a loan request was rejected it's usually due to missing documents, eligibility criteria, or score. Check the rejection reason in Credit → Request History and upload any missing documents to appeal. Pour contester, contactez le service crédit.";
            }

            else {
                return "To apply for a loan, go to Credit → New Request and complete the form. Typical required documents: ID, proof of income, and bank statements. Processing time depends on the product (usually 24–72 hours).\nPour une demande de crédit, allez dans Crédit → Nouvelle demande.";
            }
        }

        // =========================================================
        // TRANSFER (EN)
        // =========================================================
        if (message.contains("transfer")) {

            if (message.contains("failed") || message.contains("error")) {
                return "Your transfer didn’t go through. Common causes: incorrect account number/IBAN, insufficient funds, or network issues. Check the recipient details, your available balance, and try again. If funds were debited but not delivered, open a support ticket with the transaction ID.\nCauses courantes : IBAN incorrect, solde insuffisant. En cas de débit sans bonne réception, contactez le support.";
            }

            else if (message.contains("history")) {
                return "You can view all your transfers in Transfer → History, filter by date and status, and download a CSV or PDF of transactions.\nConsultez Virements → Historique pour les détails.";
            }

            else {
                return "To send money: open Transfer → New Transfer, enter recipient name, IBAN, amount and reason, then confirm with your authentication method (PIN/biometrics). For international transfers check fees and exchange rates first.";
            }
        }

        // =========================================================
        // STOCKS (EN)
        // =========================================================
        if (message.contains("order")) {
            return "Go to Stocks → Stock Order to place a buy or sell order.";
        }

        else if (message.contains("market")) {
            return "Market Watch shows live prices and market trends in real time. You can create price alerts and add tickers to your watchlist in Stocks → Market Watch.";
        }

        else if (message.contains("portfolio")) {
            return "Your Portfolio shows all your investments and performance metrics (NAV, P&L, allocation). For tax or reporting, export your portfolio from Stocks → Portfolio → Export.";
        }

        else if (message.contains("stock") || message.contains("trade")) {

            if (message.contains("history")) {
                return "You can check your trading history in Stocks → Order History. Each order includes execution time, price, fees and status.";
            }

            else {
                return "In Stocks, you can trade, follow the market, set alerts, and manage your portfolio. If you need help placing an order, I can walk you through the steps.";
            }
        }

        // =========================================================
        // SETTINGS (EN)
        // =========================================================
        if (message.contains("settings") || message.contains("password")) {

            if (message.contains("reset") || message.contains("forgot")) {
                return "If you forgot your password, use Settings → Reset Password and follow the verification prompts (email or SMS code). If you don't receive a code, check spam or contact support.";
            }

            else {
                return "You can manage your account, update personal details, enable two‑factor authentication and review active sessions in Settings → Security.";
            }
        }

        // =========================================================
        // IBAN / STATEMENTS / FEES / SUPPORT
        // =========================================================
        if (message.contains("iban") || message.contains("account number") || message.contains("numéro de compte") ) {
            return "Your IBAN and full account details are available in Accounts → Details. For official statements, go to Accounts → Statements and download monthly PDFs.\nVotre IBAN est visible dans Comptes → Détails.";
        }

        if (message.contains("statement") || message.contains("relevé") || message.contains("pdf")) {
            return "To get an account statement: Accounts → Statements → Select period → Download PDF. If you need a certified statement for official use, contact support for a stamped copy.";
        }

        if (message.contains("fees") || message.contains("frais")) {
            return "Fees and commissions are listed in Help → Fees & Pricing. Typical fees: domestic transfer fee, card issuance fee, and international transfer markup. For exact amounts check the product page or ask me about a specific fee.";
        }

        if (message.contains("support") || message.contains("contact") || message.contains("aide") || message.contains("assistance")) {
            return "You can reach support via Help → Contact Us (in-app chat), by phone at +1-800-555-0123, or by email at support@example.com. Provide transaction IDs and timestamps when reporting a problem to speed up resolution.";
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
