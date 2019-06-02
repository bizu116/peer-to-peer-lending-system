package capstone.p2plend.controller;

import capstone.p2plend.entity.Request;
import capstone.p2plend.service.AccountService;
import capstone.p2plend.service.JwtService;
import capstone.p2plend.service.RequestService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RequestController {

	@Autowired
	RequestService requestService;

	@Autowired
	AccountService accountService;

	@Autowired
	JwtService jwtService;

	@CrossOrigin
	@PostMapping(value = "/rest/createRequest")
	public Integer createAccount(@RequestBody Request request, @RequestHeader("Authorization") String token) {
		HttpStatus status = null;
		boolean valid = false;
		valid = requestService.createRequest(request, token);

		if (valid == true) {
			status = HttpStatus.OK;

		} else {
			status = HttpStatus.BAD_REQUEST;
		}

		return status.value();
	}
	
	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/deal/getById")
	public ResponseEntity<Request> getOne(@RequestParam int id) {
		return new ResponseEntity<Request>(requestService.getOneById(id), HttpStatus.OK);
	}
	
	@CrossOrigin
	@GetMapping(value = "/rest/request/all")
	public List<Request> all() {
		return requestService.findAll();
	}

	@CrossOrigin
	@GetMapping(value = "/rest/allRequest")
	public List<Request> findAllExceptUserRequest(@RequestHeader("Authorization") String token) {
		return requestService.findAllExceptUserRequest(token);
	}

	@CrossOrigin
	@GetMapping(value = "/rest/allRequestHistoryDone")
	public List<Request> findAllRequestHistoryDone(@RequestHeader("Authorization") String token) {
		return requestService.findAllRequestHistoryDone(token);
	}
	
	@CrossOrigin
	@PostMapping(value = "/rest/approveRequest")
	public Integer approveRequest(@RequestParam int requestId, @RequestHeader("Authorization") String token) {
		HttpStatus status = null;
		boolean valid = false;
		valid = requestService.approveRequest(requestId, token);

		if (valid == true) {
			status = HttpStatus.OK;
		} else {
			status = HttpStatus.BAD_REQUEST;
		}

		return status.value();
	}

	@CrossOrigin
	@DeleteMapping(value = "/rest/request/delete")
	public Integer deleteRequest(@RequestParam int id) {
		HttpStatus status = null;
		boolean valid = requestService.remove(id);
		if (valid == true) {
			status = HttpStatus.OK;
		} else {
			status = HttpStatus.BAD_REQUEST;
		}
		return status.value();
	}
}
