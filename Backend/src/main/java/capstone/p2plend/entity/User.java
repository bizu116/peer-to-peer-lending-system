package capstone.p2plend.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(value = { "hibernateLazyInitializer", "handler", "roles", "authorities" })
@Entity
@Table(name = "User")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(unique = true)
	private String username;

	@Column
	private String password;

	@Column
	private String firstName;

	@Column
	private String lastName;

	@Column
	private Long loanLimit;

	@Column
	private String role;

	@Column(unique = true)
	private String email;

	@Column
	private String phoneNumber;

	@Column
	private String status;

	@JsonIgnoreProperties(value = { "user" })
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
	private List<Deal> deal = new ArrayList<>();

	@JsonIgnoreProperties(value = { "borrower", "lender" })
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "borrower")
	private List<Request> borrowRequest = new ArrayList<>();

	@JsonIgnoreProperties(value = { "borrower", "lender" })
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "lender")
	private List<Request> lendRequest = new ArrayList<>();;

	@JsonIgnoreProperties(value = { "user" })
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
	private List<Document> document = new ArrayList<>();;

	public User() {
	}

	public User(String username, String password) {
		this.username = username;
		this.password = password;
	}

	public List<GrantedAuthority> getAuthorities() {
		List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
		authorities.add(new SimpleGrantedAuthority(role));
		return authorities;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public Long getLoanLimit() {
		return loanLimit;
	}

	public void setLoanLimit(Long loanLimit) {
		this.loanLimit = loanLimit;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public List<Deal> getDeal() {
		return deal;
	}

	public void setDeal(List<Deal> deal) {
		this.deal = deal;
	}

	public List<Request> getBorrowRequest() {
		return borrowRequest;
	}

	public void setBorrowRequest(List<Request> borrowRequest) {
		this.borrowRequest = borrowRequest;
	}

	public List<Request> getLendRequest() {
		return lendRequest;
	}

	public void setLendRequest(List<Request> lendRequest) {
		this.lendRequest = lendRequest;
	}

	public List<Document> getDocument() {
		return document;
	}

	public void setDocument(List<Document> document) {
		this.document = document;
	}

}