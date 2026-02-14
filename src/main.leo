program private_feed.aleo {

    struct Content {
        part1: field,
        part2: field
    }

    record Post {
        owner: address,
        content: Content,
        is_private: bool,
        price: u64,
    }

    record AccessTicket {
        owner: address,
        post_part1: field,
    }

    record Token {
        owner: address,
        amount: u64,
    }

    transition mint_test_tokens(amount: u64) -> Token {
        return Token {
            owner: self.caller,
            amount: amount
        };
    }

    transition create_post(part1: field, part2: field, price: u64) -> Post {
        let new_content: Content = Content {
            part1: part1,
            part2: part2
        };

        return Post {
            owner: self.caller,
            content: new_content,
            is_private: true,
            price: price
        };
    }

    transition buy_access(
        input_token: Token, 
        price_to_pay: u64, 
        author_address: address,
        post_id: field
    ) -> (Token, Token, AccessTicket) {
        
        let change_amount: u64 = input_token.amount - price_to_pay;

        let change_record: Token = Token {
            owner: self.caller,
            amount: change_amount
        };

        let payment_record: Token = Token {
            owner: author_address,
            amount: price_to_pay
        };

        let ticket: AccessTicket = AccessTicket {
            owner: self.caller,
            post_part1: post_id
        };

        return (change_record, payment_record, ticket);
    }
}