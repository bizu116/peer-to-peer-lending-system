package capstone.p2plend.repo;

import capstone.p2plend.entity.Request;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RequestRepository extends JpaRepository<Request, Integer> {

	@Query(value = "SELECT * FROM request WHERE from_account_id <> ?1", nativeQuery = true)
	List<Request> findAllUserRequestExcept(Integer id);

	@Query(value = "SELECT request.* "
			+ "FROM request "
			+ "LEFT JOIN deal ON ppls.deal.id = ppls.request.deal_id "
			+ "WHERE from_account_id = :id AND ppls.deal.status = :status", nativeQuery = true)
	List<Request> findAllUserHistoryRequestDone(@Param("id") int id, @Param("status") String status);

}
