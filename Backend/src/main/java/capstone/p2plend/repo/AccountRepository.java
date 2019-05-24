package capstone.p2plend.repo;

import capstone.p2plend.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Integer> {

	Account findByUsernameAndPassword(String username, String password);
	
	Account findByUsername(String username);
	
}
